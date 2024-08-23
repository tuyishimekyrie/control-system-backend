ALTER TABLE `user` MODIFY COLUMN `role` enum('user','manager','admin');--> statement-breakpoint
ALTER TABLE `user` ADD `organizationId` varchar(256);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `isSubscribed`;