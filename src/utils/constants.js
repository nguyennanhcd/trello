let apiRoot = ''
if (process.env.BUILD_MODE === 'dev')
{
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'production')
{
  apiRoot = 'https://dngdung.vercel.app/'
}

export const API_ROOT = apiRoot
