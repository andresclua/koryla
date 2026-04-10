import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

const ADMIN_EMAIL = 'andresclua@gmail.com'

const PLAN_PRICES: Record<string, Record<string, number>> = {
  starter: { monthly: 29, annual: 29 },
  growth: { monthly: 79, annual: 79 },
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user || user.email !== ADMIN_EMAIL) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const supabase = serverSupabaseServiceRole(event)

  // Total workspaces and plan breakdown
  const { data: workspacesRaw, error: wsErr } = await supabase
    .from('workspaces')
    .select('id, name, slug, plan, billing_period, created_at, stripe_customer_id')

  if (wsErr) throw createError({ statusCode: 500, message: wsErr.message })

  const workspaces = workspacesRaw ?? []

  // Member counts per workspace
  const { data: membersRaw, error: membersErr } = await supabase
    .from('workspace_members')
    .select('workspace_id')

  if (membersErr) throw createError({ statusCode: 500, message: membersErr.message })

  const memberCountMap: Record<string, number> = {}
  for (const m of membersRaw ?? []) {
    memberCountMap[m.workspace_id] = (memberCountMap[m.workspace_id] ?? 0) + 1
  }

  // Total experiments
  const { count: experimentsCount, error: expErr } = await supabase
    .from('experiments')
    .select('id', { count: 'exact', head: true })

  if (expErr) throw createError({ statusCode: 500, message: expErr.message })

  // Plan breakdown
  const planCounts = { free: 0, starter: 0, growth: 0 }
  let mrr = 0

  for (const ws of workspaces) {
    const plan = ws.plan as string
    const period = ws.billing_period as string

    if (plan === 'free') {
      planCounts.free++
    } else if (plan === 'starter') {
      planCounts.starter++
      mrr += PLAN_PRICES.starter?.[period] ?? PLAN_PRICES.starter.monthly
    } else if (plan === 'growth') {
      planCounts.growth++
      mrr += PLAN_PRICES.growth?.[period] ?? PLAN_PRICES.growth.monthly
    }
  }

  const workspacesWithMembers = workspaces.map((ws) => ({
    ...ws,
    member_count: memberCountMap[ws.id] ?? 0,
  }))

  return {
    total_workspaces: workspaces.length,
    plan_counts: planCounts,
    total_experiments: experimentsCount ?? 0,
    mrr,
    workspaces: workspacesWithMembers,
  }
})
