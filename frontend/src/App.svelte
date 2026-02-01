<script lang="ts">
import { onMount } from 'svelte'
import { format } from 'date-fns'

type Member = {
  userId: string
  displayName: string
  displayAvatarURL: string
}

let now: Date
let members: Member[] = []

onMount(() => {
  setInterval(() => now = new Date, 100)
  const socket = new WebSocket('/ws')
  socket.onmessage = (e) => {
    if (!e.data) return
    members = JSON.parse(e.data).members as Member[]
  }
})
</script>

<main>
  <div class="px-3 py-2 font-mono font-bold flex justify-between bg-base-200 sticky top-0">
    <div>{now && format(now, 'HH:mm')}</div>
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      {members.length}
    </div>
  </div>
  <div class="p-3 flex flex-col gap-4">
    {#each members as member}
      <div class="flex items-center gap-3">
        <img src={member.displayAvatarURL} alt={member.userId} class="h-8 rounded-full" />
        <div class="break-all">
          {member.displayName}
        </div>
      </div>
    {/each}
  </div>
</main>
