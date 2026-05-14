import * as esbuild from 'esbuild'
import fs from 'fs'

fs.mkdirSync('dist', { recursive: true })
fs.copyFileSync('index.html', 'dist/index.html')

await esbuild.build({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  outdir: 'dist',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  define: { 'process.env.NODE_ENV': '"production"' },
  minify: true,
  sourcemap: false,
  jsx: 'automatic',
})

console.log('Build complete → dist/')
