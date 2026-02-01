import { serve } from '@hono/node-server'
import { Hono } from 'hono'
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

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`)
  vcChannel = client.channels.cache.get(process.env.VC_CHANNEL || '') as VoiceChannel|undefined
  if (vcChannel) console.log(`Watching ${vcChannel.name}`)
})

const app = new Hono()

app.get('/', (c) => {
  return c.json({ members: vcChannel?.members })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  client.login(process.env.DISCORD_TOKEN)
})
