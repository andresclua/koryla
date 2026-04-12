import { serverSupabaseUser } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const [membersResult, demoResult] = await Promise.all([
    supabase
      .from('workspace_members')
      .select('role, workspace:workspaces(id, name, slug, plan, domain, auto_join_domain, billing_period, stripe_customer_id, stripe_subscription_id, is_demo)')
      .eq('user_id', user.id),
    supabase
      .from('workspaces')
      .select('id, name, slug, plan, domain, auto_join_domain, billing_period, stripe_customer_id, stripe_subscription_id, is_demo')
      .eq('is_demo', true)
      .single(),
  ])

  if (membersResult.error) throw createError({ statusCode: 500, message: membersResult.error.message })

  const userWorkspaces = (membersResult.data ?? []).map((d: any) => ({ ...d.workspace, role: d.role }))

  // Prepend demo workspace only if the user has no workspace of their own yet
  const hasOwnWorkspace = userWorkspaces.some((w: any) => !w.is_demo)
  const demoWs = demoResult.data
  if (!hasOwnWorkspace && demoWs && !userWorkspaces.find((w: any) => w.id === demoWs.id)) {
    return [{ ...demoWs, role: 'viewer' }, ...userWorkspaces]
  }

  return userWorkspaces
})
