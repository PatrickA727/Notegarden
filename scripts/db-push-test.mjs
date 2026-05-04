import { config } from 'dotenv'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

config({ path: path.resolve(process.cwd(), '.env.test') })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set after loading .env.test')
  process.exit(1)
}
if (!/notegarden_test(\?|$|\b)/.test(process.env.DATABASE_URL)) {
  console.error(`Refusing to push schema: DATABASE_URL must point at notegarden_test, got ${process.env.DATABASE_URL}`)
  process.exit(1)
}

const result = spawnSync('npx', ['drizzle-kit', 'push'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})
process.exit(result.status ?? 0)
