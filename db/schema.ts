import { relations } from "drizzle-orm";
import { pgTable, integer, text, timestamp, primaryKey, bigint, pgEnum, boolean, index } from 'drizzle-orm/pg-core'

export const mode = pgEnum('mode', ['identify', 'locate', 'sweep', 'collector']);

export const modeStats = pgTable('mode_stats', {
  userId:      text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  mode:        mode('mode').notNull(),
  attempts:    integer('attempts').notNull().default(0),
  correct:     integer('correct').notNull().default(0),
  totalTimeMs: bigint('total_time_ms', { mode: 'number' }).notNull().default(0),
  rounds:      integer('rounds').notNull().default(0),                                          // always 0 for identify/locate
  bestStreak:  integer('best_streak').notNull().default(0),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.mode] }) }));                               // Composite keys

export const weaknessBucket = pgTable('weakness_bucket', {
  userId:    text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  mode:      mode('mode').notNull(),
  key:       text('key').notNull(),                                                             // "si-fi" for all modes; collector aggregates by pitch class on read
  attempts:  integer('attempts').notNull().default(0),
  correct:   integer('correct').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.mode, t.key] }) }));

export const syncRequest = pgTable('sync_request', {
  requestId:   text('request_id').notNull(),
  userId:      text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  processedAt: timestamp('processed_at').notNull().defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.requestId] }) }));

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({                   // Relations are mainly for simpler and safer joins
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));