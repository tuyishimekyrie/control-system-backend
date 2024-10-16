import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import sudo from "sudo-prompt";
import { dbObj } from "../../drizzle/db";
import { blockedWebsites } from "../models/Blocked";
import { logger } from "../utils/Logger";

export class BlockedWebsiteService {
  private hostsFilePath: string;
  private tempFilePath: string;

  constructor() {
    this.hostsFilePath = path.join(
      "C:",
      "Windows",
      "System32",
      "drivers",
      "etc",
      "hosts",
    );
    this.tempFilePath = path.resolve(
      "C:\\Windows\\System32\\drivers\\etc\\hosts.temp",
    );
  }

  public async createBlockedWebsite(
    name: string,
    url: string,
    userId: string,
    role: string,
  ): Promise<void> {
    try {
      let websiteData: {
        name: string;
        url: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId?: string;
        parentId?: string;
        schoolId?: string;
      } = {
        name,
        url,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (role === "manager") {
        websiteData.organizationId = userId;
      } else if (role === "school") {
        websiteData.schoolId = userId;
      } else if (role === "parent") {
        websiteData.parentId = userId;
      } else {
        throw new Error("Invalid role");
      }

      await (await dbObj).insert(blockedWebsites).values(websiteData);

      await this.addHostEntry(name, url);
      console.log("Website blocked successfully");
    } catch (error: any) {
      console.error(`Error blocking website: ${error.message}`);
      throw error;
    }
  }

  public async getBlockedWebsites(
    userId: string,
    role: string,
  ): Promise<any[]> {
    try {
      let query = (await dbObj).select().from(blockedWebsites);

      if (role === "manager") {
        query.where(eq(blockedWebsites.organizationId, userId));
      } else if (role === "school") {
        query.where(eq(blockedWebsites.schoolId, userId));
      } else if (role === "parent") {
        query.where(eq(blockedWebsites.parentId, userId));
      } else if (role === "admin") {
        return await query;
      } else {
        throw new Error("Invalid role");
      }

      return await query;
    } catch (error: any) {
      console.error(`Error fetching blocked websites: ${error.message}`);
      throw error;
    }
  }

  public async updateBlockedWebsite(
    id: string,
    name: string,
    url: string,
    userId: string,
    role: string,
  ): Promise<void> {
    try {
      const oldWebsite = await (
        await dbObj
      )
        .select()
        .from(blockedWebsites)
        .where(eq(blockedWebsites.id, id))
        .then((res) => res[0]);

      if (role === "manager") {
        if (oldWebsite.organizationId !== userId) {
          throw new Error("Unauthorized");
        }
      } else if (role === "school") {
        if (oldWebsite.schoolId !== userId) {
          throw new Error("Unauthorized");
        }
      } else if (role === "parent") {
        if (oldWebsite.parentId !== userId) {
          throw new Error("Unauthorized");
        }
      } else {
        throw new Error("Invalid role");
      }

      await (await dbObj)
        .update(blockedWebsites)
        .set({ name, url, updatedAt: new Date() })
        .where(eq(blockedWebsites.id, id));

      if (oldWebsite.url) {
        await this.removeHostEntry(oldWebsite.url);
      }
      await this.addHostEntry(name, url);
      console.log("Blocked website updated successfully");
    } catch (error: any) {
      console.error(`Error updating blocked website: ${error.message}`);
      throw error;
    }
  }

  public async deleteBlockedWebsite(
    id: string,
    userId: string,
    role: string,
  ): Promise<void> {
    try {
      const website = await (
        await dbObj
      )
        .select()
        .from(blockedWebsites)
        .where(eq(blockedWebsites.id, id))
        .then((res) => res[0]);

      if (!website) {
        throw new Error("Website not found");
      }

      if (role === "manager") {
        if (website.organizationId !== userId) {
          throw new Error("Unauthorized");
        }
      } else if (role === "school") {
        if (website.schoolId !== userId) {
          throw new Error("Unauthorized");
        }
      } else if (role === "parent") {
        if (website.parentId !== userId) {
          throw new Error("Unauthorized");
        }
      } else {
        throw new Error("Invalid role");
      }

      console.log(`Deleting website: ${JSON.stringify(website)}`);

      await (await dbObj)
        .delete(blockedWebsites)
        .where(eq(blockedWebsites.id, id));

      if (website.url) {
        await this.removeHostEntry(website.url);
      }
      console.log("Blocked website deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting blocked website: ${error.message}`);
      throw error;
    }
  }

  private async addHostEntry(name: string, url: string): Promise<void> {
    try {
      const domain = new URL(url).hostname;
      const entry = `127.0.0.1 ${domain}`;
      logger.info(entry);

      const options = {
        name: "NodeJSApp",
      };

      // Using a shell-safe command to append the entry to the hosts file
      const command = `echo ${entry} >> "${this.hostsFilePath}"`;

      sudo.exec(command, options, (error: any, stdout, stderr) => {
        if (error) {
          console.error(
            `Error adding host entry using echo command: ${stderr || error.message}`,
          );
          this.addHostEntryFallback(entry);
        } else {
          console.log(`Host entry added successfully for ${name}`);
        }
      });
    } catch (error) {
      console.error(
        `Failed to create host entry. Error: ${(error as any).message}`,
      );
      throw new Error(`Failed to create host entry. ${(error as any).message}`);
    }
  }

  private async addHostEntryFallback(entry: string): Promise<void> {
    try {
      console.log(
        `Fallback: Attempting to write entry directly to hosts file.`,
      );
      fs.appendFileSync(this.hostsFilePath, entry, "utf8");
      console.log("Fallback: Host entry added successfully.");
    } catch (error) {
      console.error(
        `Fallback: Failed to add host entry. Error: ${(error as any).message}`,
      );
      throw new Error(
        `Fallback: Failed to create host entry. ${(error as any).message}`,
      );
    }
  }

  private async removeHostEntry(url: string): Promise<void> {
    try {
      const domain = new URL(url).hostname;
      const entry = `127.0.0.1 ${domain}`;

      const tempFilePath = path.join(process.env.TEMP || "", "hosts.temp");

      const readCommand = `type "${this.hostsFilePath}"`;
      sudo.exec(
        readCommand,
        { name: "MyAppName" },
        (
          error: Error | undefined,
          stdout: string | Buffer | undefined,
          stderr: string | Buffer | undefined,
        ) => {
          if (error) {
            console.error(`Error reading hosts file: ${error.message}`);
            return;
          }

          const fileContent =
            typeof stdout === "string" ? stdout : stdout?.toString() || "";

          const updatedContent = fileContent
            .split("\n")
            .filter((line) => !line.includes(entry))
            .join("\n");

          fs.writeFile(tempFilePath, updatedContent, (writeError) => {
            if (writeError) {
              console.error(
                `Error writing to temporary file: ${writeError.message}`,
              );
              return;
            }

            const replaceCommand = `move /Y "${tempFilePath}" "${this.hostsFilePath}"`;
            sudo.exec(
              replaceCommand,
              { name: "NodeJsApp" },
              (replaceError: Error | undefined) => {
                if (replaceError) {
                  console.error(
                    `Error replacing hosts file: ${replaceError.message}`,
                  );
                  throw new Error(
                    `Failed to replace hosts file. ${(replaceError as any).message}`,
                  );
                } else {
                  console.log(`Host entry removed successfully for ${domain}`);
                }
              },
            );
          });
        },
      );
    } catch (error) {
      console.error(
        `Failed to remove host entry. Error: ${(error as any).message}`,
      );
      throw new Error(`Failed to remove host entry. ${(error as any).message}`);
    }
  }

  public async dispose(): Promise<void> {
    // Any cleanup if needed
  }
}
