<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
    <UCard class="max-w-md">
      <div class="text-center">
        <UIcon name="i-heroicons-check-circle" class="text-success w-12 h-12 mb-4" />
        <h1 class="text-2xl font-bold mb-2">Application Submitted!</h1>
        <p class="text-zinc-500 mb-6">We'll review your application and get back to you soon.</p>
        <UButton label="Back to Job" variant="ghost" @click="navigateTo('/')" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" })
</script>
