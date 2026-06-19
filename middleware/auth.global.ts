export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = ["/", "/login", "/register", "/apply"];
  if (publicRoutes.some(r => to.path.startsWith(r))) return;

  try {
    const { status } = useAuth();
    if (status.value !== "authenticated") {
      return navigateTo("/login");
    }
  } catch {
    return navigateTo("/login");
  }
});
