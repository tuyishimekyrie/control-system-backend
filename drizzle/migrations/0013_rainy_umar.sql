ALTER TABLE `Logs` ADD `parentId` varchar(256);--> statement-breakpoint
ALTER TABLE `Logs` ADD `schoolId` varchar(256);--> statement-breakpoint
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_parentId_parents_id_fk` FOREIGN KEY (`parentId`) REFERENCES `parents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE cascade ON UPDATE no action;