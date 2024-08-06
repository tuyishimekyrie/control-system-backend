ALTER TABLE `user` ADD `createdAt` timestamp;--> statement-breakpoint
ALTER TABLE `user` ADD `updatedAt` timestamp;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `emailVerified`;