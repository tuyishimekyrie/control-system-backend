// controllers/BlockedWebsiteController.ts

import { Request, Response } from 'express';
import { BlockedWebsiteService } from '../services/BlockedWebsiteService';

export class BlockedWebsiteController {
  private service: BlockedWebsiteService;

  constructor() {
    this.service = new BlockedWebsiteService();
  }

  public createBlockedWebsite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, url } = req.body;
      await this.service.createBlockedWebsite(name, url);
      res.status(201).json({ message: 'Website blocked successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public getBlockedWebsites = async (_req: Request, res: Response): Promise<void> => {
    try {
      const websites = await this.service.getBlockedWebsites();
      res.status(200).json(websites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public updateBlockedWebsite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, url } = req.body;
      await this.service.updateBlockedWebsite(id, name, url);
      res.status(200).json({ message: 'Blocked website updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public deleteBlockedWebsite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteBlockedWebsite(id);
      res.status(200).json({ message: 'Blocked website deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}