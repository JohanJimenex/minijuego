import * as esbuild from 'esbuild'
import fs from 'fs'
import http from 'http'
import path from 'path'

fs.mkdirSync('dist', { recursive: true })
fs.copyFileSync('index.html', 'dist/index.html')

let ctx = await esbuild.context({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  outdir: 'dist',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  define: { 'process.env.NODE_ENV': '"development"' },
  minify: false,
  sourcemap: true,
  jsx: 'automatic',
  logLevel: 'info',
})

await ctx.watch()

const PORT = 3000
const mimeTypes = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
}

http.createServer((req, res) => {
  let filePath = path.join('dist', req.url === '/' ? 'index.html' : req.url)
  if (!fs.existsSync(filePath)) filePath = path.join('dist', 'index.html')
  const ext = path.extname(filePath)
  const content = fs.readFileSync(filePath)
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
  res.end(content)
}).listen(PORT, () => {
  console.log(`Dev server: http://localhost:${PORT}`)
})
