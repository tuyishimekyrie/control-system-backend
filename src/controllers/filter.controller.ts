import { Request, Response } from "express";
import { dbObj as db } from "../../drizzle/db";
import { Category, Keyword, URLFilter } from "../models";

export const filterController = async (req: Request, res: Response) => {
  try {
    // Fetch categories with associated URLs and keywords
    const categories = await (await db).select().from(Category).execute();
    const keywords = await (await db).select().from(Keyword).execute();
    const blockedURLs = await (await db).select().from(URLFilter).execute();

    // Structure the data by categories
    const responseData = categories.map((category) => {
      const categoryKeywords = keywords
        .filter((keyword) => keyword.categoryId === category.id)
        .map((keyword) => keyword.keyword);

      const categoryURLs = blockedURLs
        .filter((urlFilter) => urlFilter.categoryId === category.id)
        .map((urlFilter) => urlFilter.url);

      return {
        category: category.name,
        keywords: categoryKeywords,
        blockedURLs: categoryURLs,
      };
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching filter data:", (error as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
