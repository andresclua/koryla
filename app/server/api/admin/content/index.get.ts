// List .md files in content/blog and content/docs via GitHub API
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.githubToken
  const repo = config.githubRepo

  if (!token || !repo) {
    throw createError({ statusCode: 503, message: 'GitHub integration not configured' })
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Splitr-Admin',
  }

  async function listDir(path: string) {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, { headers })
    if (!res.ok) return []
    const files = await res.json() as any[]
    return files.filter((f: any) => f.type === 'file' && f.name.endsWith('.md'))
      .map((f: any) => ({ name: f.name, path: f.path, sha: f.sha }))
  }

  const [blog, docs] = await Promise.all([
    listDir('app/content/blog'),
    listDir('app/content/docs'),
  ])

  return { blog, docs }
})
