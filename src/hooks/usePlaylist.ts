import { VideoItem } from "@/types";
import { actualVideoAtom, playListAtom } from "./states";
import { useAtom } from "jotai";
import { useColor } from "./useColor";

export const usePlaylist = () => {
  const [playList, setPlayList] = useAtom(playListAtom);
  const [actualVideo, setActualVideo] = useAtom(actualVideoAtom);
  const { getColor } = useColor();

  const addVideo = (video: VideoItem) => {
    setPlayList([...playList, video]);
    if (!actualVideo) {
      setActualVideo(null);
      setVideo(video);
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
    getColor(video.snippet.thumbnails.default.url);
  };

  const nextVideo = () => {
    if (!actualVideo) return;
    const index = playList.indexOf(actualVideo);
    if (index === playList.length - 1) {
      setVideo(playList[0]);
    } else {
      setVideo(playList[index + 1]);
    }
  };

  const prevVideo = () => {
    if (!actualVideo) return;
    const index = playList.indexOf(actualVideo);
    if (index === 0) {
      setVideo(playList[playList.length - 1]);
    } else {
      setVideo(playList[index - 1]);
    }
  };

  return {
    playList,
    addVideo,
    removeVideo,
    actualVideo,
    setVideo,
    nextVideo,
    prevVideo,
  };
};
