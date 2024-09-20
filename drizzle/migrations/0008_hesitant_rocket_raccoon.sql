ALTER TABLE `user_locations` DROP FOREIGN KEY `user_locations_userId_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `user_locations` DROP COLUMN `userId`;