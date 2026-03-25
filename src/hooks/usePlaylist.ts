import { arrayMove } from "@dnd-kit/sortable";
import { VideoItem } from "@/types";
import {
  actualVideoAtom,
  favoriteVideosAtom,
  playListAtom,
  playingAtom,
  shuffleAtom,
  volumeAtom,
  addingNewVideoAtom,
  jamRoomIdAtom,
  usernameAtom,
} from "./states";
import { useAtom } from "jotai";
import { useColor } from "./useColor";
import axios from "axios";

export const usePlaylist = () => {
  const [playList, setPlayList] = useAtom(playListAtom);
  const [actualVideo, setActualVideo] = useAtom(actualVideoAtom);
  const [shuffle, setShuffle] = useAtom(shuffleAtom);
  const [playing, setPlaying] = useAtom(playingAtom);
  const [volume, setVolume] = useAtom(volumeAtom);
  const [favoriteVideos, setFavoriteVideos] = useAtom(favoriteVideosAtom);
  const [addingNewVideo, setAddingNewVideo] = useAtom(addingNewVideoAtom);
  const [jamRoomId] = useAtom(jamRoomIdAtom);
  const [username] = useAtom(usernameAtom);
  const { getColor } = useColor();

  const syncToJam = (newPlaylist: VideoItem[]) => {
    if (jamRoomId) {
      axios.put(`/api/jam/${jamRoomId}`, { playlist: newPlaylist }).catch(() => {});
    }
  };

  const addVideo = (video: VideoItem) => {
    setAddingNewVideo(true);

    const tagged: VideoItem = username ? { ...video, addedBy: username } : video;
    const updated = [...playList, tagged];
    setPlayList(updated);
    syncToJam(updated);

    if (!actualVideo || !playing) {
      setVideo(tagged);
    }

    setTimeout(() => {
      setAddingNewVideo(false);
    }, 1000);
  };

  const reorderPlaylist = (oldIndex: number, newIndex: number) => {
    const updated = arrayMove(playList, oldIndex, newIndex);
    setPlayList(updated);
    syncToJam(updated);
  };

  const removeVideo = (video: VideoItem) => {
    const updated = playList.filter((item) => item !== video);
    setPlayList(updated);
    syncToJam(updated);

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
    addingNewVideo,
    reorderPlaylist,
  };
};
