import { useEffect } from "react";
import { useAtom } from "jotai";
import { searchAtom, videosAtom } from "./states";
import axios from "axios";

export const useYoutube = () => {
  const [videos, setVideos] = useAtom(videosAtom);
  const [search, setSearch] = useAtom(searchAtom);

  const fetchVideos = async () => {
    if (search.length < 3) return;
    const response = await axios.get(`/api/youtube/search?q=${encodeURIComponent(search)}`);
    setVideos(response.data.items);
  };

  useEffect(() => {
    if (search.length < 3) {
      setVideos([]);
      return;
    }
    const timer = setTimeout(async () => {
      const response = await axios.get(`/api/youtube/search?q=${encodeURIComponent(search)}`);
      setVideos(response.data.items);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  return { videos, fetchVideos, search, setSearch, setVideos };
};
