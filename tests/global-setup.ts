// Setup once before all tests, ensures DB, etc is configured.
import { config } from 'dotenv'
import path from 'node:path'

export default async function setup() {
  config({ path: path.resolve(process.cwd(), '.env.test') })

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Did .env.test load?')
  }
  if (!/notegarden_test(\?|$|\b)/.test(process.env.DATABASE_URL)) {
    throw new Error(
      `Refusing to run tests against DATABASE_URL=${process.env.DATABASE_URL}. ` +
        `The test DB name must contain "notegarden_test" to prevent accidental dev-DB destruction.`,
    )
  }
}
