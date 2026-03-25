import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { q, maxResults = "25" } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Missing query param: q" });
  }

  const { data } = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      part: "snippet",
      maxResults,
      q,
      type: "video",
      videoDefinition: "high",
      key: process.env.GOOGLE_API_KEY,
    },
  });

  return res.status(200).json(data);
}
