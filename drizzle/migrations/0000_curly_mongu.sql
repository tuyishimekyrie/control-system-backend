CREATE TABLE `cities` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`country_id` int,
	`popularity` enum('unknown','known','popular'),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` timestamp,
	`image` text,
	`password` text,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cities` ADD CONSTRAINT `cities_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE no action ON UPDATE no action;