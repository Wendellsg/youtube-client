import { VideoItem } from "@/types";
import { actualVideoAtom, playListAtom } from "./states";
import { useAtom } from "jotai";

export const usePlaylist = () => {
  const [playList, setPlayList] = useAtom(playListAtom);
  const [actualVideo, setActualVideo] = useAtom(actualVideoAtom);

  const addVideo = (video: VideoItem) => {
    setPlayList([...playList, video]);
    if (!actualVideo) {
      setActualVideo(null);
      setActualVideo(video);
    }
  };

  const removeVideo = (video: VideoItem) => {
    setPlayList(playList.filter((item) => item !== video));

    if (actualVideo === video) {
      setActualVideo(playList[0]);
    }
  };

  const setVideo = (video: VideoItem) => {
    setActualVideo(video);
  };

  return { playList, addVideo, removeVideo, actualVideo, setVideo };
};
