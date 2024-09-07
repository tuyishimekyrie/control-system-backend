CREATE TABLE `user_locations` (
	`id` varchar(256) NOT NULL,
	`userId` varchar(256),
	`latitude` float,
	`longitude` float,
	`recordedAt` timestamp,
	CONSTRAINT `user_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_locations` ADD CONSTRAINT `user_locations_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;