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
  fetch: async (req, env, ctx) => {
    const raw_url = req.url
    const { user, hostname, pathname, rootPath, pathSegments, query, method } = await env.CTX.fetch(req.clone()).then(res => res.json())
    const json=(e,t)=>(ctx.waitUntil(fetch(`https://debug.do/ingest/${req.headers.get("CF-Ray")}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({request:{url:req.url,method:req.method,headers:Object.fromEntries(req.headers),query:Object.fromEntries(new URL(req.url).searchParams)},response:e,user,status: t?.status || 200})})),new Response(JSON.stringify(e,null,2),{headers:{"content-type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Requested-With","Cache-Control":"no-cache, no-store, must-revalidate"},...t}))
    
    if (rootPath) return json({ api, gettingStarted, examples, user })
    if (pathname.includes('favicon')) return new Response(null, { status: 302, headers: { location: 'https://uploads-ssl.webflow.com/60bee04bdb1a7a33432ce295/60ca2dd82fe6f273c60220ae_favicon_drivly.png' } })

    if (!user.authenticated) return new Response(null, { status: 302, headers: { location: api.login } })
    
    if (pathSegments[0] == 'api') return json({ api, gettingStarted, examples, user })

    let url = decodeURIComponent(pathSegments.slice(1).join('/')) + (raw_url.split('?')[1] ? `?${raw_url.split('?')[1]}` : '')
    if (!url.includes('://')) url = url.replaceAll(':/', '://')

    if (pathSegments[0] == 'templates') {
      const templateID = pathSegments[1]
      pathSegments.splice(0, 2) // Remove /templates/:templateID from pathSegments, allowing us to visit /fetch and /json endpoints

      if (method == 'POST') {
        // Create or update template
        const curl = await req.text()

        await env.STORAGE.put(
          `${ user.email }:${ templateID }`,
          curl
        )

        const variables = curl.match(/<\s*([a-zA-Z0-9_]+)\s*>/g).map(v => v.replace(/<|>/g, '').trim())
        
        return json({
          api,
          data: {
            success: true,
            message: 'Template saved successfully.',
            variables,
          },
          user
        })
      }
      
      if (method == 'DELETE') {
        // Delete template
        await env.STORAGE.delete(
          `${ user.email }:${ templateID }`
        )

        return json({
          api,
          data: {
            success: true,
            message: 'Template deleted successfully.',
          },
          user
        })
      }

      // Load template from KV
      const template = await env.STORAGE.get(
        `${user.email}:${templateID}`
      )

      if (!template) {
        return json({
          api,
          data: {
            success: false,
            error: 'Template not found, please verify the template ID and ensure you are logged in to the correct account.',
          },
          user
        }, { status: 404 })
      }

      url = template

      // Inject variables with wildcard for spaces between < and >
      for (const [key, value] of Object.entries(query)) {
        const regex = new RegExp(`<\\s*${key}\\s*>`, 'g')
        url = url.replaceAll(regex, value)
      }

      if (!pathSegments.length) {
        return new Response(url, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
      }

      if (pathSegments[0] == 'execute') {
        // Run this cURL command
        const cmd = parse(url)

        const options = {
          method: cmd.method,
          headers: cmd.header,
          body: cmd.body
        }

        const res = await fetch(cmd.url, options)
        return res
      }
    }

    if (pathSegments[0] == 'fetch') {
      const cmd = parse(url)

      const options = {
        method: cmd.method,
        headers: cmd.header,
        body: cmd.body,
      }

      return new Response(`await fetch('${cmd.url}', ${JSON.stringify(options, null, 2)})`, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
    }

    if (pathSegments[0] == 'json') {
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

    url = decodeURIComponent(pathSegments.join('/')) + (raw_url.split('?')[1] ? raw_url.split('?')[1] : '')
    if (!url.includes('://')) url = url.replaceAll(':/', '://')
  
    const cmd = parse(url)

    const data = await fetch(cmd.url, {
      method: cmd.method,
      headers: cmd.header,
      body: cmd.body,
    })
    
    return data
  }
}