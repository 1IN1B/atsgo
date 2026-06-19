<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Automations</h1>

    <div class="grid grid-cols-3 gap-4 mb-8">
      <UCard>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-document-text" class="text-primary w-6 h-6" />
          <div>
            <div class="font-medium">Resume Parser</div>
            <div class="text-xs text-zinc-500">Auto-parse & score new applications</div>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <UBadge color="success" variant="subtle">Active</UBadge>
          <span class="text-xs text-zinc-400">Trigger: new_application</span>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-envelope" class="text-primary w-6 h-6" />
          <div>
            <div class="font-medium">Stage Emails</div>
            <div class="text-xs text-zinc-500">Auto-email on stage transitions</div>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <UBadge color="success" variant="subtle">Active</UBadge>
          <span class="text-xs text-zinc-400">Trigger: stage_changed</span>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-megaphone" class="text-primary w-6 h-6" />
          <div>
            <div class="font-medium">Job Board Poster</div>
            <div class="text-xs text-zinc-500">Auto-post jobs to external boards</div>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <UBadge color="success" variant="subtle">Active</UBadge>
          <span class="text-xs text-zinc-400">Trigger: job_published</span>
        </div>
      </UCard>
    </div>

    <UCard>
      <h2 class="text-lg font-semibold mb-4">Automation Logs</h2>
      <div v-if="loading">
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-10 w-full" />
      </div>
      <UTable v-else :data="logs" :columns="logColumns">
        <template #status-cell="{ row }">
          <UBadge :color="row.original.status === 'sent' || row.original.status === 'completed' ? 'success' : row.original.status === 'failed' ? 'error' : 'neutral'" variant="subtle">
            {{ row.original.status }}
          </UBadge>
        </template>
        <template #direction-cell="{ row }">
          <UBadge variant="subtle" :color="row.original.direction === 'out' ? 'primary' : 'warning'">
            {{ row.original.direction === "out" ? "Outgoing" : "Incoming" }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "app" })

const logs = ref<any[]>([])
const loading = ref(true)
const toast = useToast()

const logColumns = [
  { key: "event", label: "Event" },
  { key: "direction", label: "Direction" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Time" },
]

async function loadLogs() {
  loading.value = true
  try {
    logs.value = await $fetch("/api/automation/logs", { params: { limit: 50 } })
  } catch (err: any) {
    toast.add({ title: "Failed to load automation logs", color: "error" })
  } finally {
    loading.value = false
  }
}

onMounted(loadLogs)
</script>
