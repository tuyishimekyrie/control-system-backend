ALTER TABLE `user` DROP FOREIGN KEY `user_organizationId_organizations_id_fk`;
--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;