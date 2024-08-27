CREATE TABLE `notifications` (
	`id` varchar(256) NOT NULL,
	`message` text,
	`unread` boolean,
	`userId` varchar(256),
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;