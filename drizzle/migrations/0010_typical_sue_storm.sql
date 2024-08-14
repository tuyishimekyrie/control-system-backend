CREATE TABLE `Category` (
	`id` varchar(256) NOT NULL,
	`name` varchar(256) NOT NULL,
	`keywords` json DEFAULT ('[]'),
	CONSTRAINT `Category_id` PRIMARY KEY(`id`),
	CONSTRAINT `Category_name_unique` UNIQUE(`name`)
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
