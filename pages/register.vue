<template>
  <div class="max-w-md w-full animate-fade-in">
    <UCard 
      class="backdrop-blur-sm border-zinc-200 dark:border-zinc-800 shadow-2xl hover:animate-shadow transition-all duration-300"
      :ui="{
        base: 'bg-zinc-50/80 dark:bg-zinc-900/80',
        ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800',
        shadow: 'shadow-2xl',
        body: { padding: 'p-8' }
      }"
    >
      <!-- Header -->
      <div class="text-center mb-8 space-y-2">
        <div class="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 flex items-center justify-center animate-float mb-4">
          <UIcon name="i-heroicons-user-plus" class="w-8 h-8 text-zinc-100 dark:text-zinc-900" />
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
          Create account
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400">
          Get started with atsgo
        </p>
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="handleSignUp">
        <UFormField label="Name" name="name">
          <UInput 
            v-model="name" 
            placeholder="Your name" 
            size="lg"
            class="focus-ring"
            :ui="{
              base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
              placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
            }"
          >
            <template #leading>
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-zinc-400" />
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput 
            v-model="email" 
            type="email" 
            placeholder="you@company.com" 
            size="lg"
            class="focus-ring"
            :ui="{
              base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
              placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
            }"
          >
            <template #leading>
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-zinc-400" />
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput 
            v-model="password" 
            type="password" 
            placeholder="Choose a password" 
            size="lg"
            class="focus-ring"
            :ui="{
              base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500',
              placeholder: 'placeholder-zinc-400 dark:placeholder-zinc-500'
            }"
          >
            <template #leading>
              <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-zinc-400" />
            </template>
          </UInput>
        </UFormField>

        <UButton 
          type="submit" 
          label="Create Account" 
          class="w-full button-press hover:animate-scale transition-all duration-300"
          :loading="loading"
          size="lg"
          :ui="{
            base: 'bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-zinc-100 dark:text-zinc-900 font-semibold',
            shadow: 'shadow-lg hover:shadow-xl',
          }"
        >
          <template #trailing>
            <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
          </template>
        </UButton>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">Or continue with</span>
          </div>
        </div>

        <UButton 
          variant="outline" 
          color="neutral" 
          label="Sign up with Google" 
          icon="i-heroicons-google" 
          class="w-full button-press hover:animate-scale transition-all duration-300"
          @click="handleGoogleSignIn"
          size="lg"
          :ui="{
            base: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium',
            shadow: 'hover:shadow-md',
          }"
        />
      </form>

      <!-- Footer -->
      <div class="text-center mt-6 animate-fade-in" style="animation-delay: 0.4s">
        <NuxtLink to="/login" class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          Already have an account? <span class="text-zinc-900 dark:text-zinc-100 font-semibold">Sign in</span>
        </NuxtLink>
      </div>

      <UNotifications />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" })

const name = ref("")
const email = ref("")
const password = ref("")
const loading = ref(false)
const toast = useToast()
const { signUp, signInWithGoogle, status } = useAuth()

watch(status, (s) => {
  if (s === "authenticated") navigateTo("/dashboard")
}, { immediate: true })

async function handleSignUp() {
  loading.value = true
  const result = await signUp(name.value, email.value, password.value)
  loading.value = false
  if (result.error) {
    toast.add({ title: "Sign up failed", description: result.error.message, color: "error" })
  }
}

async function handleGoogleSignIn() {
  await signInWithGoogle()
}
</script>

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
</style>
