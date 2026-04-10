// Get file content from GitHub
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.githubToken
  const repo = config.githubRepo

  if (!token || !repo) {
    throw createError({ statusCode: 503, message: 'GitHub integration not configured' })
  }

  const query = getQuery(event)
  const path = query.path as string
  if (!path) throw createError({ statusCode: 400, message: 'path is required' })

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Splitr-Admin',
    },
  })

  if (!res.ok) throw createError({ statusCode: res.status, message: 'File not found' })

  const data = await res.json() as any
  const content = Buffer.from(data.content, 'base64').toString('utf-8')

  return { content, sha: data.sha, path: data.path }
})
