/// <reference types="node" />
import { defineConfig } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
  },
  webServer: process.env.CI
    ? undefined
    : [
        {
          command: 'npm run dev',
          port: 5173,
          reuseExistingServer: true,
        },
        {
          command: 'node server.js',
          cwd: path.resolve(__dirname, '..', 'hospitoFind-server'),
          url: 'http://localhost:5000/ping',
          reuseExistingServer: true,
        },
      ],
})
