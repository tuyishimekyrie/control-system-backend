ALTER TABLE `user` MODIFY COLUMN `role` enum('user','manager','parent','school','admin');--> statement-breakpoint
ALTER TABLE `user` ADD `parentId` varchar(256);--> statement-breakpoint
ALTER TABLE `user` ADD `schoolId` varchar(256);--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_parentId_parents_id_fk` FOREIGN KEY (`parentId`) REFERENCES `parents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE cascade ON UPDATE no action;