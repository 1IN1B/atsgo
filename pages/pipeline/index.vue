<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
          Pipeline
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400 mt-1">Track candidates through your hiring process.</p>
      </div>
      <USelect 
        v-model="selectedJob" 
        :items="jobOptions" 
        placeholder="Select job" 
        class="w-64"
        @update:model-value="loadBoard"
        size="lg"
        :ui="{
          base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
          placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
        }"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!selectedJob" class="text-center py-16 animate-fade-in">
      <UIcon name="i-heroicons-funnel" class="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-6" />
      <h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Select a job</h3>
      <p class="text-zinc-600 dark:text-zinc-400">Choose a job to view its candidate pipeline</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="flex gap-4 animate-stagger">
      <USkeleton class="w-72 h-96 rounded-xl animate-pulse-soft" v-for="i in 4" :key="i" />
    </div>

    <!-- Pipeline Board -->
    <div v-else class="flex gap-6 overflow-x-auto pb-4 animate-fade-in">
      <div
        v-for="stage in stages"
        :key="stage.id"
        class="w-80 flex-shrink-0"
        @dragover.prevent="onDragOver(stage.id)"
        @drop="onDrop(stage.id)"
      >
        <div class="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-3">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-sm">{{ stage.name }}</h3>
            <UBadge variant="subtle" :style="{ backgroundColor: stage.color + '20', color: stage.color }">
              {{ getStageCount(stage.id) }}
            </UBadge>
          </div>

          <div class="space-y-2">
            <div
              v-for="item in getStageEntries(stage.id)"
              :key="item.entry.id"
              class="bg-zinc-50 dark:bg-zinc-800 rounded p-3 border border-zinc-200 dark:border-zinc-700 cursor-grab hover:border-primary-400 transition-colors"
              draggable="true"
              @dragstart="onDragStart(item.entry.id)"
            >
              <div class="font-medium text-sm">{{ item.candidate.name }}</div>
              <div class="text-xs text-zinc-500 mt-1">{{ item.candidate.email }}</div>
              <div v-if="item.candidate.aiScore" class="text-xs mt-1">
                <UBadge variant="subtle" :color="item.candidate.aiScore >= 70 ? 'success' : item.candidate.aiScore >= 40 ? 'warning' : 'error'">
                  Score: {{ item.candidate.aiScore }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "app" })

const route = useRoute()
const toast = useToast()
const selectedJob = ref((route.query.jobId as string) || "")
const stages = ref<any[]>([])
const entries = ref<any[]>([])
const loading = ref(false)
const dragEntryId = ref<string>("")
const dragOverStageId = ref<string>("")

const jobOptions = ref<{ label: string; value: string }[]>([])

function getStageEntries(stageId: string) {
  return entries.value.filter(e => e.entry.stageId === stageId)
}

function getStageCount(stageId: string) {
  return getStageEntries(stageId).length
}

function onDragStart(entryId: string) {
  dragEntryId.value = entryId
}

function onDragOver(stageId: string) {
  dragOverStageId.value = stageId
}

async function onDrop(targetStageId: string) {
  dragOverStageId.value = ""
  if (!dragEntryId.value) return

  try {
    await $fetch("/api/pipeline/move", {
      method: "POST",
      body: { entryId: dragEntryId.value, newStageId: targetStageId },
    })
    toast.add({ title: "Candidate moved", color: "success" })
    await loadBoard()
  } catch (err: any) {
    toast.add({ title: "Failed to move candidate", description: err.message, color: "error" })
  }
  dragEntryId.value = ""
}

async function loadJobsList() {
  try {
    const jobs = await $fetch("/api/jobs")
    jobOptions.value = (jobs as any[]).map(j => ({ label: j.title, value: j.id }))
  } catch (err: any) {
    toast.add({ title: "Failed to load jobs", color: "error" })
  }
}

async function loadStages() {
  try {
    stages.value = await $fetch("/api/pipeline/stages")
  } catch (err: any) {
    toast.add({ title: "Failed to load stages", color: "error" })
  }
}

async function loadBoard() {
  if (!selectedJob.value) return
  loading.value = true
  try {
    const data = await $fetch("/api/pipeline/board", { params: { jobId: selectedJob.value } })
    stages.value = data.stages
    entries.value = Object.values(data.grouped).flat()
  } catch (err: any) {
    toast.add({ title: "Failed to load pipeline", description: err.message, color: "error" })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadJobsList()
  await loadStages()
  if (selectedJob.value) await loadBoard()
})
</script>
