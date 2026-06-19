<template>
  <div class="flex h-screen bg-zinc-50 dark:bg-zinc-950">
    <aside class="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex flex-col animate-slide-up">
      <div class="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 animate-fade-in">atsgo</h1>
      </div>

      <div class="p-4 animate-fade-in" style="animation-delay: 0.1s">
        <USelect
          v-model="currentOrg"
          :items="orgItems"
          placeholder="Select organization"
          class="w-full"
          @update:model-value="handleOrgChange"
          :ui="{
            base: 'transition-all duration-200',
            background: 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700',
            ring: 'ring-1 ring-zinc-200 dark:ring-zinc-700 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500',
          }"
        />
      </div>

      <nav class="flex-1 px-2 py-4 space-y-1 animate-fade-in" style="animation-delay: 0.2s">
        <UButton
          v-for="(item, index) in navItems"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="item.label"
          variant="ghost"
          color="neutral"
          class="w-full justify-start hover:animate-lift transition-all duration-200 group"
          :class="[
            'hover:bg-zinc-200 dark:hover:bg-zinc-800',
            'hover:pl-6',
            'animate-stagger'
          ]"
          :style="`animation-delay: ${index * 0.05}s`"
          :ui="{
            base: 'button-press',
            color: {
              neutral: {
                ghost: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }
            }
          }"
        >
          <template #leading>
            <UIcon :name="item.icon" class="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </template>
        </UButton>
      </nav>

      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2 animate-fade-in" style="animation-delay: 0.3s">
        <UButton 
          icon="i-heroicons-cog-6-tooth" 
          label="Settings" 
          to="/settings" 
          variant="ghost" 
          color="neutral" 
          class="w-full justify-start hover:animate-lift transition-all duration-200 group"
          :ui="{
            base: 'button-press',
            color: {
              neutral: {
                ghost: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }
            }
          }"
        >
          <template #leading>
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </template>
        </UButton>
        <UButton 
          icon="i-heroicons-arrow-right-on-rectangle" 
          label="Sign Out" 
          variant="ghost" 
          color="neutral" 
          class="w-full justify-start hover:animate-lift transition-all duration-200 group"
          @click="signOut"
          :ui="{
            base: 'button-press',
            color: {
              neutral: {
                ghost: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }
            }
          }"
        >
          <template #leading>
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </template>
        </UButton>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto p-6 animate-fade-in" style="animation-delay: 0.4s">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, signOut, listOrganizations, setActiveOrg } = useAuth()
const currentOrg = ref("")
const orgItems = ref<{ label: string; value: string }[]>([])

const navItems = [
  { label: "Dashboard", icon: "i-heroicons-home", to: "/dashboard" },
  { label: "Jobs", icon: "i-heroicons-briefcase", to: "/jobs" },
  { label: "Pipeline", icon: "i-heroicons-view-columns", to: "/pipeline" },
  { label: "Candidates", icon: "i-heroicons-users", to: "/candidates" },
  { label: "Automations", icon: "i-heroicons-bolt", to: "/automations" },
]

async function loadOrgs() {
  const result = await listOrganizations()
  if (result.data) {
    orgItems.value = result.data.map(o => ({ label: o.name, value: o.id }))
    if (orgItems.value.length && !currentOrg.value) {
      currentOrg.value = orgItems.value[0].value
    }
  }
}

async function handleOrgChange(orgId: string) {
  await setActiveOrg(orgId)
}

onMounted(loadOrgs)
</script>
