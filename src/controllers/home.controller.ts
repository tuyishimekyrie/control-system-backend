import { Request, Response } from "express"


export const homeContoller = (req: Request, res: Response) => {
    res.send("Welcome User")
}