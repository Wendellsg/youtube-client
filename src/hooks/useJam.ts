import { useAtom } from "jotai";
import { useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { jamRoomIdAtom, jamUpdatedAtAtom, playListAtom } from "./states";
import { VideoItem } from "@/types";

const POLL_INTERVAL = 3000;

export const useJam = () => {
  const [roomId, setRoomId] = useAtom(jamRoomIdAtom);
  const [jamUpdatedAt, setJamUpdatedAt] = useAtom(jamUpdatedAtAtom);
  const [playList, setPlayList] = useAtom(playListAtom);
  const isSyncing = useRef(false);

  const createRoom = async (): Promise<string> => {
    const { data } = await axios.post<{ roomId: string }>("/api/jam/create");
    setRoomId(data.roomId);
    setJamUpdatedAt(Date.now());
    await axios.put(`/api/jam/${data.roomId}`, { playlist: playList });
    return data.roomId;
  };

  const joinRoom = async (code: string): Promise<{ playlist: typeof playList }> => {
    const id = code.trim().toUpperCase();
    const { data } = await axios.get(`/api/jam/${id}`);
    setRoomId(id);
    setPlayList(data.playlist);
    setJamUpdatedAt(data.updatedAt);
    return { playlist: data.playlist };
  };

  const leaveRoom = () => {
    setRoomId(null);
    setJamUpdatedAt(0);
  };

  const syncPlaylist = useCallback(
    async (newPlaylist: VideoItem[]) => {
      if (!roomId) return;
      isSyncing.current = true;
      try {
        const { data } = await axios.put(`/api/jam/${roomId}`, {
          playlist: newPlaylist,
        });
        setJamUpdatedAt(data.updatedAt);
      } finally {
        isSyncing.current = false;
      }
    },
    [roomId, setJamUpdatedAt]
  );

  // Polling
  useEffect(() => {
    if (!roomId) return;

    const poll = async () => {
      if (isSyncing.current) return;
      try {
        const { data } = await axios.get(`/api/jam/${roomId}`);
        if (data.updatedAt > jamUpdatedAt) {
          setPlayList(data.playlist);
          setJamUpdatedAt(data.updatedAt);
        }
      } catch {
        // room expired or network error, silently ignore
      }
    };

    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [roomId, jamUpdatedAt, setPlayList, setJamUpdatedAt]);

  return { roomId, createRoom, joinRoom, leaveRoom, syncPlaylist };
};
