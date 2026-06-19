export default defineNuxtConfig({
  compatibilityDate: "2025-06-13",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/fonts"],
  runtimeConfig: {
    tursoDatabaseUrl: process.env.TURSO_DATABASE_URL || "",
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN || "",
    betterAuthSecret: process.env.BETTER_AUTH_SECRET || "",
    betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    n8nBaseUrl: process.env.N8N_BASE_URL || "",
    n8nApiKey: process.env.N8N_API_KEY || "",
    n8nWebhookSecret: process.env.N8N_WEBHOOK_SECRET || "",
    alibabaApiKey: process.env.ALIBABA_API_KEY || "",
  },
  css: ['~/assets/css/main.css'],
});
