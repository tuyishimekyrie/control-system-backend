import { Request, Response } from "express";

export const homeContoller = async (req: Request, res: Response) => {
  res.send("Welcome User");
};
