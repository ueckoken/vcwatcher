import { serve } from '@hono/node-server'
import { createNodeWebSocket } from '@hono/node-ws'
import { Hono } from 'hono'
import { type WSContext } from 'hono/ws'
import { Client, Events, GatewayIntentBits, type VoiceChannel } from 'discord.js'
import 'dotenv/config'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
})

let vcChannel: VoiceChannel|undefined
const wsClients: WSContext[] = []

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`)
  vcChannel = client.channels.cache.get(process.env.VC_CHANNEL || '') as VoiceChannel|undefined
  if (vcChannel) console.log(`Watching ${vcChannel.name}`)
})

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  if (!vcChannel) return
  if (newState.channel?.id === vcChannel.id || oldState.channel?.id === vcChannel.id) {
    newState.member && console.log(newState.member.user.username, newState.channel ? 'connected.' : 'disconnected.')
    for (const ws of wsClients) {
      ws.send(JSON.stringify({ members: vcChannel?.members }))
    }
  }
})

const app = new Hono()

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })

app.get('/', (c) => {
  return c.json({ members: vcChannel?.members })
})

app.get('/ws', upgradeWebSocket((_c) => ({
  onOpen(_event, ws) {
    wsClients.push(ws)
    ws.send(JSON.stringify({ members: vcChannel?.members }))
  },
  onClose(_event, ws) {
    const i = wsClients.indexOf(ws)
    if (i !== -1) wsClients.splice(i, 1)
  },
})))

const server = serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  client.login(process.env.DISCORD_TOKEN)
})

injectWebSocket(server)
