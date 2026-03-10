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
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull(),
  email: text("email"),
  githubId: integer("github_id").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const projectTable = pgTable("project", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  slug: text("slug").unique(),
  description: text("description"),
  content: text("content"),
  priority: integer("priority").unique(),
  url: text("url"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  liveUrlText: text("live_url_text"),
  liveUrlIcon: text("live_url_icon"),
  headerImage: text("header_image"),
  headerImageAlt: text("header_image_alt"),
  visibility: text("visibility").default("public").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});
