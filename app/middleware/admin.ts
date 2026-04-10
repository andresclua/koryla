export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()
  if (user.value?.email !== 'andresclua@gmail.com') {
    return navigateTo('/dashboard')
  }
})
