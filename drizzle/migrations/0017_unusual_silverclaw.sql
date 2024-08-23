ALTER TABLE `user` MODIFY COLUMN `role` enum('user','manager');--> statement-breakpoint
ALTER TABLE `user` ADD `isSubscribed` boolean;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `organizationId`;