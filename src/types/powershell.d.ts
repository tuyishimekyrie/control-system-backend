declare module 'powershell' {
    export class PowerShell {
      constructor();
      addCommand(command: string): Promise<void>;
      invoke(): Promise<string>;
    }
  }