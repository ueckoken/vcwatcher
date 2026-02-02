<script lang="ts">
import { onMount } from 'svelte'
import { format } from 'date-fns'

type Member = {
  id: string
  username: string
  displayName: string
  displayAvatarURL: string
  deaf: boolean
  mute: boolean
  video: boolean
  streaming: boolean
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
  <div class="p-6 text-2xl font-mono font-bold flex items-center justify-between bg-base-200 sticky top-0">
    <div>{now && format(now, 'HH:mm')}</div>
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      {members.length}
    </div>
  </div>
  <div class="p-8 flex flex-col gap-6">
    {#each members as member}
      <div class="flex items-center gap-6">
        <img src={member.displayAvatarURL} alt={member.id} class="h-14 w-14 rounded-full" />
        <div class="break-all">
          <div class="text-2xl">{member.displayName}</div>
          <div class="text-sm">@{member.username}</div>
        </div>
        <div class="grow flex justify-end gap-4">
          {#if member.deaf}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphone-off-icon lucide-headphone-off"><path d="M21 14h-1.343"/><path d="M9.128 3.47A9 9 0 0 1 21 12v3.343"/><path d="m2 2 20 20"/><path d="M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3"/><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364"/></svg>
          {/if}
          {#if member.mute}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-off-icon lucide-mic-off"><path d="M12 19v3"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M16.95 16.95A7 7 0 0 1 5 12v-2"/><path d="M18.89 13.23A7 7 0 0 0 19 12v-2"/><path d="m2 2 20 20"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/></svg>
          {/if}
          {#if member.video}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video-icon lucide-video"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
          {/if}
          {#if member.streaming}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor-icon lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</main>
