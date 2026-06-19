<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
          Jobs
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400 mt-1">Manage your job postings and track applications.</p>
      </div>
      <UButton 
        icon="i-heroicons-plus" 
        label="New Job" 
        @click="showCreateModal = true"
        class="button-press hover:animate-scale transition-all duration-300"
        size="lg"
        :ui="{
          base: 'bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-zinc-100 dark:text-zinc-900 font-semibold',
          shadow: 'shadow-lg hover:shadow-xl',
        }"
      >
        <template #trailing>
          <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        </template>
      </UButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
      <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
      <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
    </div>

    <!-- Table -->
    <UCard 
      v-else
      class="hover:animate-shadow transition-all duration-300"
      :ui="{
        base: 'bg-zinc-50/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800',
        shadow: 'shadow-lg',
        body: { padding: 'p-0' },
        header: { padding: 'p-6' }
      }"
    >
      <UTable 
        :data="jobsList" 
        :columns="jobColumns" 
        class="mb-0"
        :ui="{
          thead: 'bg-zinc-100 dark:bg-zinc-800',
          th: {
            base: 'text-zinc-600 dark:text-zinc-400 font-semibold py-4',
            padding: 'px-6',
          },
          td: {
            base: 'text-zinc-700 dark:text-zinc-300 py-4',
            padding: 'px-6',
          },
          tr: {
            base: 'hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200',
          }
        }"
      >
        <template #title-cell="{ row }">
          <div class="font-medium text-zinc-900 dark:text-zinc-100">{{ row.original.title }}</div>
        </template>
        <template #status-cell="{ row }">
          <UBadge 
            :color="statusColor(row.original.status)" 
            variant="subtle"
            class="group-hover:animate-scale transition-transform"
          >
            {{ row.original.status }}
          </UBadge>
        </template>
        <template #createdAt-cell="{ row }">
          <span class="text-zinc-500 dark:text-zinc-400 text-sm">{{ formatDate(row.original.createdAt) }}</span>
        </template>
        <template #actions-cell="{ row }">
          <UDropdownMenu 
            :items="getJobActions(row.original)"
            :ui="{
              content: 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800',
              item: 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }"
          >
            <UButton 
              icon="i-heroicons-ellipsis-horizontal" 
              variant="ghost" 
              color="neutral"
              class="hover:animate-scale transition-transform"
            />
          </UDropdownMenu>
        </template>
      </UTable>
    </UCard>

    <!-- Create Modal -->
    <UModal 
      v-model:open="showCreateModal"
      :ui="{
        base: 'bg-zinc-50/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 backdrop-blur-sm',
        shadow: 'shadow-2xl',
      }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 flex items-center justify-center">
            <UIcon name="i-heroicons-briefcase" class="w-5 h-5 text-zinc-100 dark:text-zinc-900" />
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            Create New Job
          </h2>
        </div>
      </template>
      <template #body>
        <form class="space-y-6" @submit.prevent="createJob">
          <UFormField label="Title" required>
            <UInput 
              v-model="newJob.title" 
              placeholder="e.g. Senior Frontend Developer" 
              size="lg"
              class="focus-ring"
              :ui="{
                base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
                placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
              }"
            >
              <template #leading>
                <UIcon name="i-heroicons-briefcase" class="w-5 h-5 text-zinc-400" />
              </template>
            </UInput>
          </UFormField>
          <UFormField label="Department">
            <UInput 
              v-model="newJob.department" 
              placeholder="e.g. Engineering" 
              size="lg"
              class="focus-ring"
              :ui="{
                base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
                placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
              }"
            />
          </UFormField>
          <UFormField label="Location">
            <UInput 
              v-model="newJob.location" 
              placeholder="e.g. Remote / New York" 
              size="lg"
              class="focus-ring"
              :ui="{
                base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
                placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
              }"
            />
          </UFormField>
          <UFormField label="Type">
            <USelect 
              v-model="newJob.type" 
              :items="jobTypes" 
              placeholder="Select type" 
              size="lg"
              class="focus-ring"
              :ui="{
                base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
                placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
              }"
            />
          </UFormField>
          <UFormField label="Description">
            <UTextarea 
              v-model="newJob.description" 
              placeholder="Job description..." 
              :rows="5"
              class="focus-ring"
              :ui="{
                base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
                placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
              }"
            />
          </UFormField>
          <UFormField label="Requirements">
            <UTextarea 
              v-model="newJob.requirements" 
              placeholder="Key requirements..." 
              :rows="3"
              class="focus-ring"
              :ui="{
                base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
                placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
              }"
            />
          </UFormField>
          <div class="flex gap-3 pt-4">
            <UButton 
              type="submit" 
              label="Save as Draft" 
              @click="newJob.status = 'draft'"
              class="flex-1 button-press hover:animate-scale transition-all duration-300"
              size="lg"
              :ui="{
                base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold',
                shadow: 'hover:shadow-md',
              }"
            />
            <UButton 
              type="submit" 
              label="Publish" 
              color="primary" 
              @click="newJob.status = 'published'"
              class="flex-1 button-press hover:animate-scale transition-all duration-300"
              size="lg"
              :ui="{
                base: 'bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-zinc-100 dark:text-zinc-900 font-semibold',
                shadow: 'shadow-lg hover:shadow-xl',
              }"
            />
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "app" })

const showCreateModal = ref(false)
const jobsList = ref<any[]>([])
const loading = ref(true)
const toast = useToast()

const jobColumns = [
  { key: "title", label: "Title" },
  { key: "department", label: "Department" },
  { key: "location", label: "Location" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
  { key: "actions", label: "" },
]

const jobTypes = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
]

const newJob = ref({
  title: "",
  department: "",
  location: "",
  type: "",
  description: "",
  requirements: "",
  status: "draft",
})

function statusColor(status: string) {
  const colors: Record<string, string> = { draft: "neutral", published: "primary", closed: "error", paused: "warning" }
  return colors[status] || "neutral"
}

function formatDate(date: string | null) {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
}

function getJobActions(job: any) {
  return [
    [{ label: "View Pipeline", icon: "i-heroicons-view-columns", click: () => navigateTo(`/pipeline?jobId=${job.id}`) }],
    job.status === "draft" ? [{ label: "Publish", icon: "i-heroicons-rocket", click: () => toggleStatus(job.id, "published") }] : [],
    job.status === "published" ? [{ label: "Close", icon: "i-heroicons-x-circle", click: () => toggleStatus(job.id, "closed") }] : [],
    [{ label: "Delete", icon: "i-heroicons-trash", click: () => deleteJob(job.id) }],
  ].filter(group => group.length)
}

async function toggleStatus(jobId: string, status: string) {
  try {
    await $fetch(`/api/jobs/${jobId}`, { method: "PATCH", body: { status } })
    toast.add({ title: `Job ${status === "published" ? "published" : "closed"}`, color: "success" })
    await loadJobs()
  } catch (err: any) {
    toast.add({ title: "Failed to update job", description: err.message, color: "error" })
  }
}

async function deleteJob(jobId: string) {
  try {
    await $fetch(`/api/jobs/${jobId}`, { method: "DELETE" })
    toast.add({ title: "Job deleted", color: "success" })
    await loadJobs()
  } catch (err: any) {
    toast.add({ title: "Failed to delete job", description: err.message, color: "error" })
  }
}

async function createJob() {
  try {
    await $fetch("/api/jobs", { method: "POST", body: { ...newJob.value } })
    showCreateModal.value = false
    newJob.value = { title: "", department: "", location: "", type: "", description: "", requirements: "", status: "draft" }
    toast.add({ title: "Job created", color: "success" })
    await loadJobs()
  } catch (err: any) {
    toast.add({ title: "Failed to create job", description: err.message, color: "error" })
  }
}

async function loadJobs() {
  loading.value = true
  try {
    jobsList.value = await $fetch("/api/jobs")
  } catch (err: any) {
    toast.add({ title: "Failed to load jobs", description: err.message, color: "error" })
  } finally {
    loading.value = false
  }
}

onMounted(loadJobs)
</script>

<style scoped>
/* Add subtle background pattern */
.min-h-screen {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(113, 113, 122, 0.03) 1px, transparent 0);
  background-size: 20px 20px;
}
.dark .min-h-screen {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(82, 82, 91, 0.05) 1px, transparent 0);
}
</style>
