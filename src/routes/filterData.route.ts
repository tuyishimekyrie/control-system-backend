import { Router } from "express";
import { dbObj as db } from "../../drizzle/db";
import { Category, Keyword, URLFilter } from "../models";

const filterDataRoute = Router();

// Route to fetch all categories, URL filters, and keywords
filterDataRoute.get("/filter-url", async (req, res) => {
  try {
    // Fetch categories
    const categories = await (await db).select().from(Category).execute();
    console.log("Categories:", categories);

    // Fetch keywords
    const keywords = await (await db).select().from(Keyword).execute();
    console.log("Keywords:", keywords);

    // Fetch blocked URLs
    const blockedURLs = await (await db).select().from(URLFilter).execute();
    console.log("Blocked URLs:", blockedURLs);

    // Format the response data
    const responseData = {
      categories: categories.map((cat) => cat.name),
      keywords: keywords.map((keyword) => keyword.keyword),
      blockedURLs: blockedURLs.map((urlFilter) => urlFilter.url),
    };

    // Send the response with a 200 status
    res.status(200).json(responseData);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching filter data:", (error as Error).message);

    // Send a 500 response with error details
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default filterDataRoute;