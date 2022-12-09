import parse from './curl.js'

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
    if (pathname.includes('favicon')) return new Response(null, { status: 302, headers: { location: 'https://uploads-ssl.webflow.com/60bee04bdb1a7a33432ce295/60ca2dd82fe6f273c60220ae_favicon_drivly.png' } })

    if (!user.authenticated) return new Response(null, { status: 302, headers: { location: api.login } })
    
    const cmd = parse(pathSegments.join('/'))

    console.log(
      'CMD',
      pathSegments.join('/'),
      cmd
    )

    const data = await fetch(cmd.url, {
      method: cmd.method,
      headers: cmd.header,
      body: cmd.body,
    })
    
    return data
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
