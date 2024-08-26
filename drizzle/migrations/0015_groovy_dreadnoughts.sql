ALTER TABLE `Keyword` ADD `categoryId` serial AUTO_INCREMENT;--> statement-breakpoint
ALTER TABLE `URLFilter` ADD `categoryId` serial AUTO_INCREMENT;--> statement-breakpoint
ALTER TABLE `Keyword` ADD CONSTRAINT `Keyword_categoryId_Category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `URLFilter` ADD CONSTRAINT `URLFilter_categoryId_Category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE no action ON UPDATE no action;