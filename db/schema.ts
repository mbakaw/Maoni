import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('maoni_posts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  text: text('text').notNull(),
  topic: text('topic').notNull(),
  authorHash: text('author_hash').notNull(),
  createdAt: integer('created_at').notNull(),
}, (t) => [index('posts_created_idx').on(t.createdAt), index('posts_author_idx').on(t.authorHash)]);

export const votes = sqliteTable('maoni_votes', {
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  visitorHash: text('visitor_hash').notNull(),
}, (t) => [primaryKey({columns: [t.postId, t.visitorHash]})]);
