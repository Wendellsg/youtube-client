import { VideoItem } from "@/types";
import { atom } from "jotai";

export const playListAtom = atom<VideoItem[]>([]);
export const actualVideoAtom = atom<VideoItem | null>(null);
export const videosAtom = atom<VideoItem[]>([]);
export const searchAtom = atom<string>("");
export const colorAtom = atom<string>("238, 130, 238");
export const shuffleAtom = atom<boolean>(false);
export const volumeAtom = atom<number>(100);
export const playingAtom = atom<boolean>(false);
export const favoriteVideosAtom = atom<VideoItem[]>([]);
export const addingNewVideoAtom = atom<boolean>(false);

// Jam
export const jamRoomIdAtom = atom<string | null>(null);
export const jamUpdatedAtAtom = atom<number>(0);

// User
export const usernameAtom = atom<string>("");
