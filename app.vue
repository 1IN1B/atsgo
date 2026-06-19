<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 300, ease: 'easeOut' } }"
        :leave="{ opacity: 0, y: -20, transition: { duration: 200, ease: 'easeIn' } }"
      />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
// Enable page transitions globally
definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  },
  layoutTransition: {
    name: 'layout',
    mode: 'out-in'
  }
});
</script>
