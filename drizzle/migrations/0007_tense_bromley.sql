CREATE TABLE `blockedWebsite` (
	`id` varchar(256) NOT NULL,
	`name` text,
	`url` text,
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `blockedWebsite_id` PRIMARY KEY(`id`)
);
