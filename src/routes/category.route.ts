import { Router } from "express";
import { dbObj as db } from "../../drizzle/db";
import { Category, Keyword, URLFilter } from "../models";
import { eq } from "drizzle-orm";

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

// Insert a new keyword
categoryRoute.post("/keywords", async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    const newKeyword = await (await db)
      .insert(Keyword)
      .values({ keyword })
      .execute();

    res.status(201).json(newKeyword);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
// Fetch all categories
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
    const blockedURLs = await (
      await db
    )
      .select()
      .from(URLFilter) // Assuming 'URLFilter' is the correct table name
      .execute();

    res.status(200).json(blockedURLs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default categoryRoute;
