ALTER TABLE `user` DROP FOREIGN KEY `user_organization_id_organizations_id_fk`;
--> statement-breakpoint
ALTER TABLE `user` ADD `organizationId` varchar(256);--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `organization_id`;