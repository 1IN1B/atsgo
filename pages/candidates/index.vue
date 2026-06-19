<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Candidates</h1>
      <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search candidates..." class="w-64" @update:model-value="loadCandidates" />
    </div>

    <div v-if="loading" class="space-y-2">
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
    </div>

    <UTable v-else :data="candidatesList" :columns="candidateColumns">
      <template #aiScore-cell="{ row }">
        <UBadge v-if="row.original.aiScore" variant="subtle" :color="row.original.aiScore >= 70 ? 'success' : row.original.aiScore >= 40 ? 'warning' : 'error'">
          {{ row.original.aiScore }}
        </UBadge>
        <span v-else class="text-zinc-400">-</span>
      </template>
      <template #createdAt-cell="{ row }">
        {{ formatDate(row.original.createdAt) }}
      </template>
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="getCandidateActions(row.original)">
          <UButton icon="i-heroicons-ellipsis-horizontal" variant="ghost" color="neutral" />
        </UDropdownMenu>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "app" })

const candidatesList = ref<any[]>([])
const loading = ref(true)
const search = ref("")
const toast = useToast()

const candidateColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "source", label: "Source" },
  { key: "aiScore", label: "AI Score" },
  { key: "createdAt", label: "Applied" },
  { key: "actions", label: "" },
]

function formatDate(date: string | null) {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
}

function getCandidateActions(candidate: any) {
  return [
    [{ label: "View Profile", icon: "i-heroicons-user", click: () => {} }],
    [{ label: "Edit", icon: "i-heroicons-pencil", click: () => {} }],
  ]
}

async function loadCandidates() {
  loading.value = true
  try {
    const params: Record<string, string> = { limit: "50" }
    if (search.value) params.search = search.value
    candidatesList.value = await $fetch("/api/candidates", { params })
  } catch (err: any) {
    toast.add({ title: "Failed to load candidates", description: err.message, color: "error" })
  } finally {
    loading.value = false
  }
}

onMounted(loadCandidates)
</script>
