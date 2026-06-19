import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export function useAuth() {
  const session = authClient.useSession();

  const user = computed(() => {
    const d = session.data;
    return d?.user ?? null;
  });

  const org = computed(() => {
    const d = session.data;
    return d?.session?.activeOrganizationId ?? null;
  });

  const status = computed(() => {
    if (session.isPending) return "loading";
    if (session.error) return "error";
    if (user.value) return "authenticated";
    return "unauthenticated";
  });

  async function signIn(email: string, password: string) {
    return authClient.signIn.email({ email, password });
  }

  async function signUp(name: string, email: string, password: string) {
    return authClient.signUp.email({ name, email, password });
  }

  async function signOut() {
    await authClient.signOut();
    navigateTo("/login");
  }

  async function signInWithGoogle() {
    return authClient.signIn.social({ provider: "google" });
  }

  async function setActiveOrg(orgId: string) {
    await $fetch("/api/organizations/switch", {
      method: "POST",
      body: { organizationId: orgId },
    });
    await session.refetch();
  }

  async function listOrganizations() {
    return $fetch("/api/organizations");
  }

  async function createOrganization(name: string, slug: string) {
    return $fetch("/api/organizations", {
      method: "POST",
      body: { name, slug },
    });
  }

  return {
    session,
    user,
    org,
    status,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    setActiveOrg,
    listOrganizations,
    createOrganization,
  };
}
