import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      'server-only': path.resolve(root, 'tests/stubs/server-only.ts'),
      '@': root,
    },
  },
  test: {
    environment: 'node',
    globalSetup: ['./tests/global-setup.ts'],
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,
    hookTimeout: 20_000,
    testTimeout: 20_000,
  },
})
