ALTER TABLE `user` ADD `organization_id` varchar(256);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `organizationId`;