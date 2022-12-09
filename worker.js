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
  runCurl: 'https://curl.do/curl%20-X%20POST%20-H%20%22Content-Type%3A%20application%2Fjson%22%20-d%20\'%7B%22name%22%3A%22John%20Doe%22%7D\'%20https%3A%2F%2Fjsonplaceholder.typicode.com%2Fusers',
}

export default {
  fetch: async (req, env) => {
    const raw_url = req.url
    const { user, hostname, pathname, rootPath, pathSegments, query } = await env.CTX.fetch(req).then(res => res.json())
    if (rootPath) return json({ api, gettingStarted, examples, user })
    if (pathname.includes('favicon')) return new Response(null, { status: 302, headers: { location: 'https://uploads-ssl.webflow.com/60bee04bdb1a7a33432ce295/60ca2dd82fe6f273c60220ae_favicon_drivly.png' } })

    if (!user.authenticated) return new Response(null, { status: 302, headers: { location: api.login } })
    
    if (pathSegments[0] == 'api') return json({ api, gettingStarted, examples, user })

    if (pathSegments[0] == 'fetch') {
      let url = decodeURIComponent(pathSegments.slice(1).join('/')) + raw_url.split('?')[1]
      if (!url.includes('://')) url = url.replaceAll(':/', '://')
      
      const cmd = parse(url)

      const options = {
        method: cmd.method,
        headers: cmd.header,
        body: cmd.body,
      }

      return new Response(`await fetch('${cmd.url}', ${JSON.stringify(options, null, 2)})`, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
    }

    if (pathSegments[0] == 'json') {
      let url = decodeURIComponent(pathSegments.slice(1).join('/')) + raw_url.split('?')[1]
      if (!url.includes('://')) url = url.replaceAll(':/', '://')
      
      const cmd = parse(url)

      return json({
        api,
        data: {
          link: `https://${hostname}/${encodeURIComponent(url)}`,
          parsed: cmd
        },
        user,
      })
    }

    let url = decodeURIComponent(pathSegments.join('/')) + raw_url.split('?')[1]
    if (!url.includes('://')) url = url.replaceAll(':/', '://')

    console.log(url)
  
    const cmd = parse(url)

    const data = await fetch(cmd.url, {
      method: cmd.method,
      headers: cmd.header,
      body: cmd.body,
    })
    
    return data
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
