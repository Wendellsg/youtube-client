import type { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";
import { VideoItem } from "@/types";

const JAM_TTL = 60 * 60 * 24; // 24 hours

interface JamRoom {
  playlist: VideoItem[];
  updatedAt: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query as { roomId: string };
  const key = `jam:${roomId}`;

  if (req.method === "GET") {
    const raw = await redis.get(key);
    if (!raw) return res.status(404).json({ error: "Room not found" });
    return res.status(200).json(JSON.parse(raw) as JamRoom);
  }

  if (req.method === "PUT") {
    const raw = await redis.get(key);
    if (!raw) return res.status(404).json({ error: "Room not found" });

    const { playlist } = req.body as { playlist: VideoItem[] };
    const room: JamRoom = { playlist, updatedAt: Date.now() };

    await redis.set(key, JSON.stringify(room), "EX", JAM_TTL);
    return res.status(200).json(room);
  }

  return res.status(405).end();
}
