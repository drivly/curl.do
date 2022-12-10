# 🌠 CURL.do - CURL Parse & Fetch API

This primitive API allows you to parse and execute cURL statements. It also allows you to create and execute templates for cURL statements.

### Routes
##### `GET /:statement`
Runs a CURL statement and returns the response.

##### `GET /fetch/:statement`
Generates a fetch handler for a CURL statement, including all of the headers and the correct body required to make the request.

##### `GET /json/:statement`
Returns the parsed JSON representation of the cURL statement.

#### `POST /templates/:templateID`
Creates a new template with the given ID and statement. The template should be submitted as the body of the request.  
Templates are localized to the account that created them, meaning you must be authenticated to read the template later on.  
Since the query is passed to the cURL statement, you must use the Authorization header or use a browser manually.  

For example:

```bash
curl -X POST https://curl.do/templates/my-template \
  -H "Content-Type: text/plain" \
  -d "curl -X POST https://api.example.com/<userID>/<hello-world>
```

You can modify the template by including query parameters in all template requests. Submitting `?hello-world=foo&userID=bar` to the above template would result in the following request:

```bash
curl -X POST https://api.example.com/bar/foo
```

##### `GET /templates/:templateID`
Returns the template's raw statement. Includes query parameter templating support.

```bash
curl -X GET https://curl.do/templates/my-template?hello-world=foo&userID=bar
```

##### `GET /templates/:templateID/fetch`
##### `GET /templates/:templateID/json`
##### `GET /templates/:templateID/execute`
Same as the previous routes, but for templates. Includes query parameter templating support. Execute runs the template and returns the response.

## [Drivly Open](https://driv.ly/open) - [Accelerating Innovation through Open Source](https://blog.driv.ly/accelerating-innovation-through-open-source)

Our [Drivly Open Philosophy](https://philosophy.do) has these key principles:

1. [Build in Public](https://driv.ly/open/build-in-public)
2. [Create Amazing Developer Experiences](https://driv.ly/open/amazing-developer-experiences)
3. [Everything Must Have an API](https://driv.ly/open/everything-must-have-an-api)
4. [Communicate through APIs not Meetings](https://driv.ly/open/communicate-through-apis-not-meetings)
5. [APIs Should Do One Thing, and Do It Well](https://driv.ly/open/apis-do-one-thing)


##  🚀 We're Hiring!

[Driv.ly](https://driv.ly) is [deconstructing the monolithic physical dealership](https://blog.driv.ly/deconstructing-the-monolithic-physical-dealership) into [simple APIs to buy and sell cars online](https://driv.ly), and we're funded by some of the [biggest names](https://twitter.com/TurnerNovak) in [automotive](https://fontinalis.com/team/#bill-ford) and [finance & insurance](https://www.detroit.vc)

Our entire infrastructure is built with [Cloudflare Workers](https://workers.do), [Durable Objects](https://durable.objects.do), [KV](https://kv.cf), [PubSub](https://pubsub.do), [R2](https://r2.do.cf), [Pages](https://pages.do), etc.  [If you love the Cloudflare Workers ecosystem as much as we do](https://driv.ly/loves/workers), we'd love to have you [join our team](https://careers.do/apply)!


