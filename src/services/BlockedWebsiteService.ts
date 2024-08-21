import { dbObj } from "../../drizzle/db";
import { blockedWebsites } from "../models/Blocked";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import sudo from "sudo-prompt";

export class BlockedWebsiteService {
  private hostsFilePath: string;

  constructor() {
    this.hostsFilePath = path.join(
      "C:",
      "Windows",
      "System32",
      "drivers",
      "etc",
      "hosts",
    );
  }

  public async createBlockedWebsite(name: string, url: string): Promise<void> {
    try {
      await (await dbObj).insert(blockedWebsites).values({
        name,
        url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.addHostEntry(name, url);
      console.log("Website blocked successfully");
    } catch (error: any) {
      console.error(`Error blocking website: ${error.message}`);
      throw error;
    }
  }

  public async getBlockedWebsites(): Promise<any[]> {
    try {
      return await (await dbObj).select().from(blockedWebsites);
    } catch (error: any) {
      console.error(`Error fetching blocked websites: ${error.message}`);
      throw error;
    }
  }

  public async updateBlockedWebsite(
    id: string,
    name: string,
    url: string,
  ): Promise<void> {
    try {
      const oldWebsite = await (
        await dbObj
      )
        .select()
        .from(blockedWebsites)
        .where(eq(blockedWebsites.id, id))
        .then((res) => res[0]);

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

  public async deleteBlockedWebsite(id: string): Promise<void> {
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
      const entry = `127.0.0.1 ${domain}\n`;

      const options = {
        name: "control-system-backend",
      };

      sudo.exec(
        `echo ${JSON.stringify(entry)} >> "${this.hostsFilePath}"`,
        options,
        (error: any, stdout, stderr) => {
          if (error) {
            console.error(
              `Error adding host entry using echo command: ${stderr || error.message}`,
            );
            this.addHostEntryFallback(entry);
          } else {
            console.log(`Host entry added successfully for ${name}`);
          }
        },
      );
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
      const entryPattern = `127.0.0.1 ${domain}`;

      const options = {
        name: "ControlSystem",
      };

      console.log(`Attempting to remove entry: ${entryPattern}`);

      const command = `powershell -Command "
            $content = Get-Content '${this.hostsFilePath}';
            $lineRemoved = $false;
            $newContent = @();
            foreach ($line in $content) {
                if ($line.Trim() -eq '${entryPattern}') {
                    $lineRemoved = $true;
                } else {
                    $newContent += $line;
                }
            }
            $newContent | Set-Content '${this.hostsFilePath}';
            if ($lineRemoved) { 
                Write-Output 'Entry removed'
            } else { 
                Write-Output 'Entry not found'
            }
        "`;

      sudo.exec(command, options, (error, stdout, stderr) => {
        if (error) {
          console.error(
            `Error removing host entry using PowerShell command: ${stderr || error.message}`,
          );
          throw new Error(
            `Error removing host entry: ${stderr || error.message}`,
          );
        }
        console.log(`PowerShell output: ${stdout}`);
        console.log(`Host entry operation completed for ${domain}`);
      });
    } catch (error) {
      console.error(`Error removing host entry: ${(error as any).message}`);
      throw new Error("Failed to remove host entry.");
    }
  }

  public async dispose(): Promise<void> {
    // Any cleanup if needed
  }
}
