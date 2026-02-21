import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userTable = pgTable("user", {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text("username").notNull(),
  email: text("email"),
  githubId: integer("github_id").unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const projectTable = pgTable("project", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  priority: integer("priority").unique(),
  url: text("url"),
  logoImage: text("logo_image"),
  logoImageAlt: text("logo_image_alt"),
  headerImage: text("header_image"),
  headerImageAlt: text("header_image_alt"),
  createdAt: timestamp('created_at').defaultNow(),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

export const projectRelations = relations(projectTable, ({ many }) => ({
  technologies: many(projectTechnologyTable),
}));

export const technologyTable = pgTable("technology", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text("name"),
  slug: text("slug"),
  iconUrl: text("icon_url"),
  iconAlt: text("icon_alt"),
  createdAt: timestamp('created_at').defaultNow(),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

export const technologyRelations = relations(technologyTable, ({ many }) => ({
  projects: many(projectTechnologyTable),
}));

export const projectTechnologyTable = pgTable("project_technology", {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projectTable.id)
    .notNull(),
  technologyId: uuid("technology_id")
    .references(() => technologyTable.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

export const projectTechnologyRelations = relations(projectTechnologyTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [projectTechnologyTable.projectId],
    references: [projectTable.id],
  }),
  technology: one(technologyTable, {
    fields: [projectTechnologyTable.technologyId],
    references: [technologyTable.id],
  }),
}));
