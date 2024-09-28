ALTER TABLE `user` DROP FOREIGN KEY `user_parentId_parents_id_fk`;
--> statement-breakpoint
ALTER TABLE `user` DROP FOREIGN KEY `user_schoolId_schools_id_fk`;
--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `role` enum('user','manager','admin');--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `parentId`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `schoolId`;