import { VideoItem } from "@/types";
import { useState } from "react";
import { atom, useAtom } from "jotai";
import { searchAtom, videosAtom } from "./states";
import axios from "axios";

export const useYoutube = () => {
  const [videos, setVideos] = useAtom(videosAtom);
  const [search, setSearch] = useAtom(searchAtom);

  const fetchVideos = async () => {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${search}&type=video&videoDefinition=high&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    setVideos(response.data.items);
  };

  return { videos, fetchVideos, search, setSearch, setVideos };
};
