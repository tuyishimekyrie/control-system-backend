ALTER TABLE `blockedWebsite` ADD `organizationId` varchar(256);--> statement-breakpoint
ALTER TABLE `blockedWebsite` ADD `parentId` varchar(256);--> statement-breakpoint
ALTER TABLE `blockedWebsite` ADD `schoolId` varchar(256);--> statement-breakpoint
ALTER TABLE `blockedWebsite` ADD CONSTRAINT `blockedWebsite_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blockedWebsite` ADD CONSTRAINT `blockedWebsite_parentId_parents_id_fk` FOREIGN KEY (`parentId`) REFERENCES `parents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blockedWebsite` ADD CONSTRAINT `blockedWebsite_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE cascade ON UPDATE no action;