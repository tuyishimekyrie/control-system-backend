CREATE TABLE `blockedWebsite` (
	`id` varchar(256) NOT NULL,
	`name` text,
	`url` text,
	`organizationId` varchar(256),
	`parentId` varchar(256),
	`schoolId` varchar(256),
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `blockedWebsite_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Category` (
	`id` varchar(256) NOT NULL,
	`name` varchar(256) NOT NULL,
	`keywords` json DEFAULT ('[]'),
	CONSTRAINT `Category_id` PRIMARY KEY(`id`),
	CONSTRAINT `Category_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `geofences` (
	`id` varchar(256) NOT NULL,
	`latitude` decimal(9,6) NOT NULL,
	`longitude` decimal(9,6) NOT NULL,
	`radius` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `geofences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(256) NOT NULL,
	`name` text,
	`image` text,
	`ipAddress` varchar(45),
	`macAddress` varchar(45),
	`email` text,
	`password` text,
	`role` enum('user','manager','parent','school','admin'),
	`organizationId` varchar(256),
	`parentId` varchar(256),
	`schoolId` varchar(256),
	`isSubscribed` boolean,
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Keyword` (
	`id` varchar(256) NOT NULL,
	`name` varchar(256) NOT NULL,
	`categoryId` varchar(256),
	CONSTRAINT `Keyword_id` PRIMARY KEY(`id`),
	CONSTRAINT `Keyword_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `URLFilter` (
	`id` varchar(256) NOT NULL,
	`name` varchar(256) NOT NULL,
	`categoryId` varchar(256),
	CONSTRAINT `URLFilter_id` PRIMARY KEY(`id`),
	CONSTRAINT `URLFilter_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Logs` (
	`id` varchar(256) NOT NULL,
	`name` text,
	`email` text,
	`organizationId` varchar(256),
	`parentId` varchar(256),
	`schoolId` varchar(256),
	`url` text,
	`duration` time,
	`date` date,
	CONSTRAINT `Logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `organizations` (
	`id` varchar(256) NOT NULL,
	`name` varchar(255),
	`maxUsers` int,
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user_locations` (
	`id` varchar(256) NOT NULL,
	`userId` varchar(256),
	`latitude` float,
	`longitude` float,
	`recordedAt` timestamp,
	CONSTRAINT `user_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parents` (
	`id` varchar(256) NOT NULL,
	`name` varchar(255),
	`maxUsers` int,
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `parents_id` PRIMARY KEY(`id`),
	CONSTRAINT `parents_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `schools` (
	`id` varchar(256) NOT NULL,
	`name` varchar(255),
	`maxUsers` int,
	`createdAt` timestamp,
	`updatedAt` timestamp,
	CONSTRAINT `schools_id` PRIMARY KEY(`id`),
	CONSTRAINT `schools_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `blockedWebsite` ADD CONSTRAINT `blockedWebsite_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blockedWebsite` ADD CONSTRAINT `blockedWebsite_parentId_parents_id_fk` FOREIGN KEY (`parentId`) REFERENCES `parents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blockedWebsite` ADD CONSTRAINT `blockedWebsite_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_parentId_parents_id_fk` FOREIGN KEY (`parentId`) REFERENCES `parents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Keyword` ADD CONSTRAINT `Keyword_categoryId_Category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `URLFilter` ADD CONSTRAINT `URLFilter_categoryId_Category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_parentId_parents_id_fk` FOREIGN KEY (`parentId`) REFERENCES `parents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_locations` ADD CONSTRAINT `user_locations_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;