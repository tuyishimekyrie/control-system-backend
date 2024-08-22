import { Request, Response } from "express";
import { users } from "../models";
import { dbObj } from "../../drizzle/db";
import { eq } from "drizzle-orm";

export const subscriptionContoller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "No Id Provided" });
    }
    const response = await (await dbObj)
      .update(users)
      .set({ isSubscribed: true })
      .where(eq(users.id, id));

    if (response) {
      res.status(200).json({ message: "User Subscribed Successfully" });
    }
    res.status(400).json({ message: "User Not Found" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
