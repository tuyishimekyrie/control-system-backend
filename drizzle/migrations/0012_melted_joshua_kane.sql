ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_userId_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;