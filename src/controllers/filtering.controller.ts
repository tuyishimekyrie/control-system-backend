import { Request, Response } from "express";

export const filteringController = (req: Request, res: Response) => {
  res.send("Filterning");
};
