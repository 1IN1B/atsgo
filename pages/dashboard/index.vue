<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-sm text-zinc-500 dark:text-zinc-400">Current Organization</p>
          <p class="font-semibold text-zinc-900 dark:text-zinc-100">{{ currentOrg?.name || 'Loading...' }}</p>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard 
        v-for="(stat, index) in statCards" 
        :key="stat.label"
        class="hover:animate-lift transition-all duration-300 group animate-stagger"
        :style="{ animationDelay: `${index * 0.1}s` }"
        :ui="{
          base: 'bg-zinc-50/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800',
          shadow: 'shadow-lg hover:shadow-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-sm font-medium text-zinc-600 dark:text-zinc-400">{{ stat.label }}</div>
            <div class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-1 group-hover:animate-scale transition-transform">
              {{ stat.value }}
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.color">
            <UIcon :name="stat.icon" class="w-6 h-6 text-zinc-50 dark:text-zinc-900" />
          </div>
        </div>
        <div class="mt-4">
          <div class="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 transition-all duration-1000"
              :style="{ width: stat.loading ? '0%' : '100%' }"
            ></div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <UCard 
        class="hover:animate-shadow transition-all duration-300"
        :ui="{
          base: 'bg-zinc-50/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800',
          shadow: 'shadow-lg',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            Recent Activity
          </h2>
          <UButton 
            variant="ghost" 
            color="neutral" 
            label="View all" 
            size="sm"
            class="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          />
        </div>
        
        <div v-if="loading" class="space-y-3">
          <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
          <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
          <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
        </div>
        
        <div v-else-if="recentActivity.length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <p class="text-zinc-500 dark:text-zinc-400">No recent activity</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="(activity, index) in recentActivity" 
            :key="activity.id"
            class="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 hover:animate-lift group animate-stagger"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:animate-scale transition-transform">
                <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ activity.action }} — {{ activity.entity }}</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{{ formatDate(activity.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Automation Status -->
      <UCard 
        class="hover:animate-shadow transition-all duration-300"
        :ui="{
          base: 'bg-zinc-50/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800',
          shadow: 'shadow-lg',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            Automation Status
          </h2>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-zinc-400 animate-pulse-soft"></div>
            <span class="text-sm text-zinc-600 dark:text-zinc-400">Live</span>
          </div>
        </div>
        
        <div v-if="loading" class="space-y-3">
          <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
          <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
          <USkeleton class="h-16 w-full rounded-xl animate-pulse-soft" />
        </div>
        
        <div v-else-if="automationLogs.length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-bolt-slash" class="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <p class="text-zinc-500 dark:text-zinc-400">No automation logs</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="(log, index) in automationLogs" 
            :key="log.id"
            class="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 hover:animate-lift group animate-stagger"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div 
                  class="w-3 h-3 rounded-full animate-pulse-soft"
                  :class="{
                    'bg-zinc-600': log.status === 'sent' || log.status === 'completed',
                    'bg-zinc-400': log.status === 'failed',
                    'bg-zinc-400': log.status === 'neutral' || !log.status
                  }"
                ></div>
                <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ log.event }}</span>
              </div>
              <UBadge 
                :color="log.status === 'sent' || log.status === 'completed' ? 'success' : log.status === 'failed' ? 'error' : 'neutral'" 
                variant="subtle"
                size="sm"
                class="group-hover:animate-scale transition-transform"
              >
                {{ log.direction }}
              </UBadge>
            </div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2">{{ formatDate(log.createdAt) }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "app" })

const stats = ref({ activeJobs: 0, applications: 0, interviews: 0, hired: 0 })
const recentActivity = ref<any[]>([])
const automationLogs = ref<any[]>([])
const loading = ref(true)
const toast = useToast()
const currentOrg = ref<{ name: string } | null>(null)

const statCards = computed(() => [
  { label: "Active Jobs", value: stats.value.activeJobs, icon: "i-heroicons-briefcase", color: "bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300" },
  { label: "Applications", value: stats.value.applications, icon: "i-heroicons-document-text", color: "bg-gradient-to-br from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400" },
  { label: "Interviews", value: stats.value.interviews, icon: "i-heroicons-user-group", color: "bg-gradient-to-br from-zinc-700 to-zinc-500 dark:from-zinc-300 dark:to-zinc-500" },
  { label: "Hired", value: stats.value.hired, icon: "i-heroicons-check-circle", color: "bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400" },
])

async function loadDashboard() {
  loading.value = true
  try {
    stats.value = await $fetch("/api/dashboard/stats")
    recentActivity.value = await $fetch("/api/dashboard/activity", { params: { limit: 10 } })
    automationLogs.value = await $fetch("/api/automation/logs", { params: { limit: 10 } })
  } catch (err: any) {
    toast.add({ title: "Failed to load dashboard", description: err.message, color: "error" })
  } finally {
    loading.value = false
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

onMounted(async () => {
  await loadDashboard()
  // Get current org from session
  const { session } = useAuth()
  if (session.value?.session?.activeOrganizationId) {
    const orgs = await $fetch('/api/organizations')
    currentOrg.value = orgs.find((o: any) => o.id === session.value.session.activeOrganizationId) || null
  }
})
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
