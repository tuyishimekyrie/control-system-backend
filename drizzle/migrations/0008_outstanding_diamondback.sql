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
DROP TABLE `Logs`;