<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
    <div class="max-w-2xl mx-auto">
      <UCard>
        <h1 class="text-2xl font-bold mb-2">Apply for {{ jobTitle }}</h1>
        <p v-if="jobData" class="text-zinc-500 mb-1">{{ jobData.department }} · {{ jobData.location }} · {{ jobData.type }}</p>
        <p class="text-zinc-500 mb-6">Submit your application below</p>

        <form class="space-y-4" @submit.prevent="submitApplication">
          <UFormField label="Full Name" required>
            <UInput v-model="application.name" placeholder="John Doe" />
          </UFormField>

          <UFormField label="Email" required>
            <UInput v-model="application.email" type="email" placeholder="john@example.com" />
          </UFormField>

          <UFormField label="Phone">
            <UInput v-model="application.phone" placeholder="+1 234 567 890" />
          </UFormField>

          <UFormField label="Resume URL">
            <UInput v-model="application.resumeUrl" placeholder="Link to your resume or CV" />
          </UFormField>

          <UFormField label="Cover Letter">
            <UTextarea v-model="application.coverLetter" placeholder="Why are you interested in this role?" :rows="5" />
          </UFormField>

          <UFormField label="Source">
            <USelect v-model="application.source" :items="sourceOptions" />
          </UFormField>

          <UButton type="submit" label="Submit Application" color="primary" :loading="submitting" />
        </form>

        <UNotifications />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" })

const route = useRoute()
const jobId = route.query.jobId as string
const orgId = route.query.orgId as string
const jobTitle = ref("Open Position")
const jobData = ref<any>(null)
const submitting = ref(false)
const toast = useToast()

const application = ref({
  name: "",
  email: "",
  phone: "",
  resumeUrl: "",
  coverLetter: "",
  source: "direct",
})

const sourceOptions = [
  { label: "Direct", value: "direct" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Referral", value: "referral" },
  { label: "Job Board", value: "job_board" },
  { label: "Other", value: "other" },
]

async function loadJob() {
  if (!jobId) return
  try {
    jobData.value = await $fetch(`/api/jobs/${jobId}/public`)
    jobTitle.value = jobData.value.title
  } catch {
    toast.add({ title: "Job not found", color: "error" })
  }
}

async function submitApplication() {
  submitting.value = true
  try {
    await $fetch("/api/applications/apply", {
      method: "POST",
      body: { ...application.value, orgId, jobId },
    })
    navigateTo("/apply/success")
  } catch (err: any) {
    toast.add({ title: "Failed to submit application", description: err.message, color: "error" })
    submitting.value = false
  }
}

onMounted(loadJob)
</script>
