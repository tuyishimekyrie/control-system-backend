import os from "os";
import { exec } from "child_process";

function getInstalledApplications() {
  const platform = os.platform();

  if (platform === "win32") {
    // Windows OS
    exec("wmic product get name,version", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`Installed Applications (Windows):\n${stdout}`);
    });
  } else if (platform === "darwin") {
    // macOS
    exec("ls /Applications", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`Installed Applications (macOS):\n${stdout}`);
    });
  } else if (platform === "linux") {
    // Linux (Debian-based)
    exec("dpkg -l", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`Installed Applications (Linux):\n${stdout}`);
    });
  } else {
    console.log("Unsupported OS");
  }
}

export default getInstalledApplications;
