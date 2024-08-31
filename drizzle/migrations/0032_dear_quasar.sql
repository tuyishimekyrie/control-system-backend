CREATE TABLE `user` (
	`id` varchar(256) NOT NULL,
	`name` text NOT NULL,
	`ipAddress` varchar(45),
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` enum('user','manager','admin') NOT NULL,
	`organizationId` varchar(256),
	`isSubscribed` boolean,
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;