import { VideoItem } from "@/types";
import { atom } from "jotai";

export const playListAtom = atom<VideoItem[]>([]);
export const actualVideoAtom = atom<VideoItem | null>(null);
export const videosAtom = atom<VideoItem[]>([]);
export const searchAtom = atom<string>("");
