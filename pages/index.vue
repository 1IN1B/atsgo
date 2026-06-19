<template>
  <div class="max-w-2xl w-full animate-fade-in">
    <UCard 
      class="backdrop-blur-sm border-zinc-200 dark:border-zinc-800 shadow-2xl hover:animate-shadow transition-all duration-300"
      :ui="{
        base: 'bg-zinc-50/80 dark:bg-zinc-900/80',
        ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800',
        shadow: 'shadow-2xl'
      }"
    >
      <div class="text-center space-y-6 p-8">
        <!-- Logo/Brand -->
        <div class="flex justify-center mb-4">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 flex items-center justify-center animate-float">
            <UIcon name="i-heroicons-briefcase" class="w-10 h-10 text-zinc-100 dark:text-zinc-900" />
          </div>
        </div>

        <!-- Title -->
        <div class="space-y-2">
          <h1 class="text-5xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent animate-fade-in">
            atsgo
          </h1>
          <p class="text-xl text-zinc-600 dark:text-zinc-400 animate-fade-in" style="animation-delay: 0.2s">
            Applicant Tracking System
          </p>
        </div>

        <!-- Description -->
        <p class="text-zinc-500 dark:text-zinc-500 max-w-md mx-auto leading-relaxed animate-fade-in" style="animation-delay: 0.4s">
          Streamline your hiring process with intelligent candidate tracking, automated workflows, and collaborative pipeline management.
        </p>

        <!-- CTA Button -->
        <div class="pt-4 animate-fade-in" style="animation-delay: 0.6s">
          <UButton 
            label="Go to Dashboard" 
            to="/dashboard" 
            size="xl"
            class="button-press hover:animate-scale transition-all duration-300"
            :ui="{
              base: 'bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-zinc-100 dark:text-zinc-900 font-semibold px-8 py-3 rounded-xl',
              shadow: 'shadow-lg hover:shadow-xl',
            }"
          >
            <template #trailing>
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 animate-bounce-subtle" />
            </template>
          </UButton>
        </div>

        <!-- Feature Highlights -->
        <div class="grid grid-cols-3 gap-4 pt-6 animate-fade-in" style="animation-delay: 0.8s">
          <div class="text-center space-y-2 group">
            <div class="w-12 h-12 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:animate-scale transition-all">
              <UIcon name="i-heroicons-users" class="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Candidate Management</p>
          </div>
          <div class="text-center space-y-2 group">
            <div class="w-12 h-12 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:animate-scale transition-all">
              <UIcon name="i-heroicons-funnel" class="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Smart Pipeline</p>
          </div>
          <div class="text-center space-y-2 group">
            <div class="w-12 h-12 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:animate-scale transition-all">
              <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Automations</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" })
</script>

<style scoped>
/* Add subtle glow effect */
.bg-gradient-to-br {
  position: relative;
  overflow: hidden;
}
.bg-gradient-to-br::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}
.dark .bg-gradient-to-br::before {
  background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
}
</style>
