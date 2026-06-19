<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Settings</h1>

    <div class="grid grid-cols-2 gap-6">
      <UCard>
        <h2 class="text-lg font-semibold mb-4">Organization</h2>
        <form v-if="org" class="space-y-4" @submit.prevent="updateOrg">
          <UFormField label="Name">
            <UInput v-model="orgForm.name" />
          </UFormField>
          <UFormField label="Slug">
            <UInput v-model="orgForm.slug" />
          </UFormField>
          <UFormField label="Plan">
            <UBadge variant="subtle" :color="org.plan === 'pro' ? 'primary' : 'neutral'">{{ org.plan }}</UBadge>
          </UFormField>
          <UButton type="submit" label="Save" color="primary" :loading="savingOrg" />
        </form>
        <div v-else class="text-zinc-500 text-sm">No active organization selected</div>
      </UCard>

      <UCard>
        <h2 class="text-lg font-semibold mb-4">Integrations</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">n8n Cloud</div>
              <div class="text-xs text-zinc-500">Workflow automation</div>
            </div>
            <UBadge :color="hasN8n ? 'success' : 'neutral'" variant="subtle">{{ hasN8n ? "Connected" : "Not configured" }}</UBadge>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">Alibaba AI (Qwen)</div>
              <div class="text-xs text-zinc-500">Resume parsing & scoring</div>
            </div>
            <UBadge :color="hasAlibaba ? 'success' : 'neutral'" variant="subtle">{{ hasAlibaba ? "Connected" : "Not configured" }}</UBadge>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">Google OAuth</div>
              <div class="text-xs text-zinc-500">Social sign-in</div>
            </div>
            <UBadge :color="hasGoogle ? 'success' : 'neutral'" variant="subtle">{{ hasGoogle ? "Connected" : "Not configured" }}</UBadge>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "app" })

const org = ref<any>(null)
const orgForm = ref({ name: "", slug: "" })
const savingOrg = ref(false)
const loading = ref(true)
const toast = useToast()

const config = useRuntimeConfig()
const hasN8n = computed(() => !!config.public.n8nBaseUrl || !!config.n8nBaseUrl)
const hasAlibaba = computed(() => !!config.public.alibabaApiKey || !!config.alibabaApiKey)
const hasGoogle = computed(() => !!config.public.googleClientId || !!process.env.GOOGLE_CLIENT_ID)

async function loadOrg() {
  loading.value = true
  try {
    org.value = await $fetch("/api/organizations/current")
    orgForm.value.name = org.value.name
    orgForm.value.slug = org.value.slug
  } catch (err: any) {
    toast.add({ title: "Failed to load organization", color: "error" })
  } finally {
    loading.value = false
  }
}

async function updateOrg() {
  savingOrg.value = true
  try {
    await $fetch("/api/organizations/current", { method: "PATCH", body: orgForm.value })
    toast.add({ title: "Organization updated", color: "success" })
    await loadOrg()
  } catch (err: any) {
    toast.add({ title: "Failed to update organization", description: err.message, color: "error" })
  } finally {
    savingOrg.value = false
  }
}

onMounted(loadOrg)
</script>
