// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t3-glucotracker_${name}`);

export const posts = createTable(
	"post",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		name: d.varchar({ length: 256 }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [index("name_idx").on(t.name)],
);

export const user = createTable("user", (d) => ({
	id: d.text('id').primaryKey(),
	name: d.text('name').notNull(),
	email: d.text('email').notNull().unique(),
	emailVerified: d.boolean('email_verified').notNull(),
	image: d.text('image'),
	createdAt: d.timestamp('created_at').notNull(),
	updatedAt: d.timestamp('updated_at').notNull(),
}), (t) => ({
	emailIdx: index('email_idx').on(t.email),
}));

export const session = createTable("session", (d) => ({
	id: d.text('id').primaryKey(),
	expiresAt: d.timestamp('expires_at').notNull(),
	token: d.text('token').notNull().unique(),
	createdAt: d.timestamp('created_at').notNull(),
	updatedAt: d.timestamp('updated_at').notNull(),
	ipAddress: d.text('ip_address'),
	userAgent: d.text('user_agent'),
	userId: d.text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
}), (t) => ({
	userIdSessionIdx: index('user_id_session_idx').on(t.userId),
}));

export const account = createTable("account", (d) => ({
	id: d.text('id').primaryKey(),
	accountId: d.text('account_id').notNull(),
	providerId: d.text('provider_id').notNull(),
	userId: d.text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: d.text('access_token'),
	refreshToken: d.text('refresh_token'),
	idToken: d.text('id_token'),
	accessTokenExpiresAt: d.timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: d.timestamp('refresh_token_expires_at'),
	scope: d.text('scope'),
	password: d.text('password'),
	createdAt: d.timestamp('created_at').notNull(),
	updatedAt: d.timestamp('updated_at').notNull(),
}), (t) => ({
	userIdAccountIdx: index('user_id_account_idx').on(t.userId),
}));

export const verification = createTable("verification", (d) => ({
	id: d.text('id').primaryKey(),
	identifier: d.text('identifier').notNull(),
	value: d.text('value').notNull(),
	expiresAt: d.timestamp('expires_at').notNull(),
	createdAt: d.timestamp('created_at'),
	updatedAt: d.timestamp('updated_at')
}))

