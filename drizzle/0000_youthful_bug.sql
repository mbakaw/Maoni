CREATE TABLE `maoni_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`text` text NOT NULL,
	`topic` text NOT NULL,
	`author_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `posts_created_idx` ON `maoni_posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `posts_author_idx` ON `maoni_posts` (`author_hash`);--> statement-breakpoint
CREATE TABLE `maoni_votes` (
	`post_id` text NOT NULL,
	`visitor_hash` text NOT NULL,
	PRIMARY KEY(`post_id`, `visitor_hash`),
	FOREIGN KEY (`post_id`) REFERENCES `maoni_posts`(`id`) ON UPDATE no action ON DELETE cascade
);
