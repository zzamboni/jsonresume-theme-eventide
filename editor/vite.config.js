import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  return {
    base: './',
    build: {
      outDir: '../public',
      target: 'esnext',
    },
    publicDir: false,
  }
})
