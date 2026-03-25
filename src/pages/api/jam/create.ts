import type { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";

const JAM_TTL = 60 * 60 * 24; // 24 hours

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const roomId = generateRoomId();
  const room = { playlist: [], updatedAt: Date.now() };

  await redis.set(`jam:${roomId}`, JSON.stringify(room), "EX", JAM_TTL);

  return res.status(200).json({ roomId });
}
