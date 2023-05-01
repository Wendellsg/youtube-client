import { VideoItem } from "@/types";
import {
  actualVideoAtom,
  favoriteVideosAtom,
  playListAtom,
  playingAtom,
  shuffleAtom,
  volumeAtom,
} from "./states";
import { useAtom } from "jotai";
import { useColor } from "./useColor";

export const usePlaylist = () => {
  const [playList, setPlayList] = useAtom(playListAtom);
  const [actualVideo, setActualVideo] = useAtom(actualVideoAtom);
  const [shuffle, setShuffle] = useAtom(shuffleAtom);
  const [playing, setPlaying] = useAtom(playingAtom);
  const [volume, setVolume] = useAtom(volumeAtom);
  const [favoriteVideos, setFavoriteVideos] = useAtom(favoriteVideosAtom);
  const { getColor } = useColor();

  const addVideo = (video: VideoItem) => {
    setPlayList([...playList, video]);
    if (!actualVideo || !playing) {
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

    if (shuffle) {
      const index = Math.floor(Math.random() * playList.length);
      setVideo(playList[index]);
      return;
    }

    const index = playList.indexOf(actualVideo);
    if (index === playList.length - 1) {
      setVideo(playList[0]);
    } else {
      setVideo(playList[index + 1]);
    }
  };

  const prevVideo = () => {
    if (!actualVideo) return;

    if (shuffle) {
      const index = Math.floor(Math.random() * playList.length);
      setVideo(playList[index]);
      return;
    }

    const index = playList.indexOf(actualVideo);
    if (index === 0) {
      setVideo(playList[playList.length - 1]);
    } else {
      setVideo(playList[index - 1]);
    }
  };

  const addFavoriteVideo = (video: VideoItem) => {
    setFavoriteVideos([...favoriteVideos, video]);

    //Save in local storage
    localStorage.setItem(
      "favoriteVideos",
      JSON.stringify([...favoriteVideos, video])
    );
  };

  const removeFavoriteVideo = (videoId: string) => {
    setFavoriteVideos(
      favoriteVideos.filter((item) => item.id.videoId !== videoId)
    );

    //Save in local storage
    localStorage.setItem(
      "favoriteVideos",
      JSON.stringify(
        favoriteVideos.filter((item) => item.id.videoId !== videoId)
      )
    );
  };

  const getFavoriteVideos = () => {
    const favoriteVideos = localStorage.getItem("favoriteVideos");
    if (favoriteVideos) {
      setFavoriteVideos(JSON.parse(favoriteVideos));
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
    shuffle,
    setShuffle,
    volume,
    setVolume,
    playing,
    setPlaying,
    favoriteVideos,
    addFavoriteVideo,
    removeFavoriteVideo,
    getFavoriteVideos,
  };
};
