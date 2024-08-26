import { Router } from "express";
import { dbObj as db } from "../../drizzle/db";
import { Category, Keyword, URLFilter } from "../models";

const categoryRoute = Router();

// Insert a new category
categoryRoute.post("/categories", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const newCategory = await (await db)
      .insert(Category)
      .values({ name })
      .execute();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Insert a new keyword associated with a category
categoryRoute.post("/keywords", async (req, res) => {
  const { keyword, categoryId } = req.body;

  if (!keyword || !categoryId) {
    return res
      .status(400)
      .json({ error: "Keyword and category ID are required" });
  }

  try {
    const newKeyword = await (await db)
      .insert(Keyword)
      .values({ keyword, categoryId })
      .execute();

    res.status(201).json(newKeyword);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Insert a new blocked URL associated with a category
categoryRoute.post("/blocked-urls", async (req, res) => {
  const { url, categoryId } = req.body;

  if (!url || !categoryId) {
    return res
      .status(400)
      .json({ error: "Blocked URL and category ID are required" });
  }

  try {
    const newBlockedURL = await (await db)
      .insert(URLFilter)
      .values({ url, categoryId })
      .execute();

    res.status(201).json(newBlockedURL);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Fetch all categories
categoryRoute.get("/categories", async (req, res) => {
  try {
    const categories = await (await db).select().from(Category).execute();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Fetch all keywords
categoryRoute.get("/keywords", async (req, res) => {
  try {
    const keywords = await (await db).select().from(Keyword).execute();

    res.status(200).json(keywords);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Fetch all blocked URLs
categoryRoute.get("/blocked-urls", async (req, res) => {
  try {
    const blockedURLs = await (await db).select().from(URLFilter).execute();

    res.status(200).json(blockedURLs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default categoryRoute;
