import { Request, Response } from "express";

export const logoutController = (req: Request, res: Response) => {
  res.removeHeader("Authorization");
  res.clearCookie("authToken");
  res.send("Logout User");
};
