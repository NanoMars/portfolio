import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

const timestamps = {
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow(),
};

const baseFields = {
  id: uuid('id').defaultRandom().primaryKey(),
  ...timestamps,
};

export const userTable = pgTable("user", {
  ...baseFields,
  username: text("username").notNull(),
  email: text("email"),
  github_id: integer("github_id").unique().notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  expires_at: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull(),
  ...timestamps,
});

export const projectTable = pgTable("project", {
  ...baseFields,
  name: varchar("name").notNull(),
  description: text("description"),
  priority: integer("priority").unique(),
  url: text("url"),
  logo_image: text("logo_image"),
  logo_image_alt: text("logo_image_alt"),
  header_image: text("header_image"),
  header_image_alt: text("header_image_alt"),
});

export const technologyTable = pgTable("technology", {
  ...baseFields,
  name: text("name"),
  slug: text("slug"),
  icon_url: text("icon_url"),
  icon_alt: text("icon_alt"),
});

export const projectTechnologyTable = pgTable("project_technology", {
  ...baseFields,
  project_id: uuid("project_id")
    .references(() => projectTable.id)
    .notNull(),

  technology_id: uuid("technology_id")
    .references(() => technologyTable.id)
    .notNull(),
});
