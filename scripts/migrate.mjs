import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

const sql = postgres(url, {
  max: 1,
  ssl: process.env.DATABASE_SSL === 'require' ? 'require' : false,
})
const db = drizzle(sql)

console.log('Applying migrations from ./db/migrations')
await migrate(db, { migrationsFolder: './db/migrations' })
console.log('Migrations applied')
await sql.end()
