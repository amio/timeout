const fs = require('fs')
const path = require('path')
const http = require('http')

module.exports = async function (req, res) {
  const { accept } = req.headers
  if (req.url === '/' && accept && accept.includes('text/html')) {
    const readmeFile = path.join(__dirname, '../README.md')
    return res.end(fs.readFileSync(readmeFile))
  }

  res.writeHead(200, {
    'content-type': 'text/plain'
  })

  const start = Date.now()
  const delay = Math.min(Number(req.url.replace('/', '')) || 0, 10000)

  const interval = setInterval(() => {
    res.write(`${Date.now() - start}ms\n`)
  }, 1000)

  setTimeout(() => {
    clearInterval(interval)
    res.end(`${Date.now() - start}ms end.`)
  }, delay)
}

if (require.main === module) {
  const { PORT = 5000 } = process.env
  http.createServer(module.exports).listen(PORT)
}
