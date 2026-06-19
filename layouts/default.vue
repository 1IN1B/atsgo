<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 animate-fade-in">
    <NuxtPage class="page-enter" />
  </div>
</template>

<style scoped>
/* Add subtle background pattern */
.min-h-screen {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(113, 113, 122, 0.05) 1px, transparent 0);
  background-size: 20px 20px;
}
.dark .min-h-screen {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(82, 82, 91, 0.1) 1px, transparent 0);
}
.page-enter {
  animation: page-enter 400ms ease-out;
}
@keyframes page-enter {
  from {
    opacity: 0;
    scale: 0.95;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
</style>
