CREATE TABLE `Category` (
	`id` varchar(256) NOT NULL,
	`name` varchar(256) NOT NULL,
	`keywords` json DEFAULT ('[]'),
	CONSTRAINT `Category_id` PRIMARY KEY(`id`),
	CONSTRAINT `Category_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(256) NOT NULL,
	`name` text,
	`email` text,
	`image` text,
	`password` text,
	`role` enum('user','manager'),
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Keyword` (
	`id` varchar(256) NOT NULL,
	`name` varchar(256) NOT NULL,
	CONSTRAINT `Keyword_id` PRIMARY KEY(`id`),
	CONSTRAINT `Keyword_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `URLFilter` (
	`id` varchar(256) NOT NULL,
	`name` varchar(256) NOT NULL,
	CONSTRAINT `URLFilter_id` PRIMARY KEY(`id`),
	CONSTRAINT `URLFilter_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Logs` (
	`id` varchar(256) NOT NULL,
	`name` text,
	`email` text,
	`url` text,
	`duration` time,
	`date` date,
	CONSTRAINT `Logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `UserSettings` (
	`ipAddress` varchar(45) NOT NULL,
	`keywords` json DEFAULT ('[]'),
	`categories` json DEFAULT ('[]'),
	`blockedURLs` json DEFAULT ('[]'),
	CONSTRAINT `UserSettings_ipAddress` PRIMARY KEY(`ipAddress`)
);
