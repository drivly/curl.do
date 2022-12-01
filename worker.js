export const api = {
  icon: '🚀',
  name: 'CURL.do',
  description: 'CURL Parse & Fetch API',
  url: 'https://curl.do/api',
  type: 'https://apis.do/utilities',
  endpoints: {
    listCategories: 'https://curl.do/api',
    getCategory: 'https://curl.do/:type',
  },
  site: 'https://curl.do',
  login: 'https://curl.do/login',
  signup: 'https://curl.do/signup',
  subscribe: 'https://curl.do/subscribe',
  repo: 'https://github.com/drivly/curl.do',
}

export const gettingStarted = [
  `If you don't already have a JSON Viewer Browser Extension, get that first:`,
  `https://extensions.do`,
]

export const examples = {
  listItems: 'https://curl.do/worker',
}

export default {
  fetch: async (req, env) => {
    const { user, hostname, pathname, rootPath, pathSegments, query } = await env.CTX.fetch(req).then(res => res.json())
    if (rootPath) return json({ api, gettingStarted, examples, user })
    
    // TODO: Implement this
    const [ resource, id ] = pathSegments
    const data = { resource, id, hello: user.city }
    
    return json({ api, data, user })
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
