const fs = require('fs')
const path = require('path')
const http = require('http')
const { measure } = require('measurement-protocol')

module.exports = async function (req, res) {
  const { accept } = req.headers
  if (req.url === '/' && accept && accept.includes('text/html')) {
    const readmeFile = path.join(__dirname, '../README.md')
    return res.end(fs.readFileSync(readmeFile))
  }

  measure('UA-4646421-13').pageview(req.url).send()

  const ms = Math.min(Number(req.url.replace('/', '')) || 0, 10000)
  await new Promise(resolve => setTimeout(resolve, ms))
  res.end(JSON.stringify({ status: 'ok', delayed: ms + 'ms' }))
}

if (require.main === module) {
  const { PORT = 5000 } = process.env
  http.createServer(module.exports).listen(PORT)
}
