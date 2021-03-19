import { resolve } from 'path'

export default ({ mode }) => ({
  root: 'src',

  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  },

  build: {
    outDir: resolve(process.cwd(), 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input:
        mode === 'development'
          ? resolve(process.cwd(), 'src/index.html')
          : resolve(process.cwd(), 'src/index.js')
    }
  }
})
