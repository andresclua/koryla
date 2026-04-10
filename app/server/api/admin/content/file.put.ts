// Save file content to GitHub (creates a commit)
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.githubToken
  const repo = config.githubRepo

  if (!token || !repo) {
    throw createError({ statusCode: 503, message: 'GitHub integration not configured' })
  }

  const { path, content, sha, message } = await readBody<{
    path: string
    content: string
    sha: string
    message?: string
  }>(event)

  if (!path || !content || !sha) {
    throw createError({ statusCode: 400, message: 'path, content and sha are required' })
  }

  const encoded = Buffer.from(content, 'utf-8').toString('base64')

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Splitr-Admin',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message ?? `Update ${path}`,
      content: encoded,
      sha,
    }),
  })

  if (!res.ok) {
    const err = await res.json() as any
    throw createError({ statusCode: res.status, message: err.message ?? 'Failed to save' })
  }

  return { ok: true }
})
