/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import YouTube, {
  YouTubeProps,
  YouTubeEvent,
  YouTubePlayer,
} from "react-youtube";
import {
  BsFillPlayCircleFill,
  BsPauseCircleFill,
  BsFillSkipEndFill,
  BsFillSkipStartFill,
  BsShuffle,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { VideoItem } from "@/types";
import { useColor } from "@/hooks/useColor";
import { usePlaylist } from "@/hooks/usePlaylist";

// Fora do componente: objeto estável, não recriado a cada render
const YT_OPTS: YouTubeProps["opts"] = {
  height: "0",
  width: "0",
  playerVars: {
    autoplay: 1,
  },
};

const Player: React.FC<{ video: VideoItem }> = ({ video }) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const { color } = useColor();
  const {
    nextVideo,
    prevVideo,
    setShuffle,
    setVolume,
    shuffle,
    volume,
    playing,
    setPlaying,
    favoriteVideos,
    removeFavoriteVideo,
    addFavoriteVideo,
  } = usePlaylist();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  // Reseta timers ao trocar de vídeo (sem resetar playerReady — mesmo player é reutilizado)
  useEffect(() => {
    setCurrentTime(0);
    setTotalTime(0);
  }, [video.id.videoId]);

  const progress = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;

  const isFavorite = favoriteVideos.find(
    (fav) => fav.id.videoId === video.id.videoId
  );

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    setPlayerReady(true);
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) {
      setTotalTime(event.target.getDuration());
    }
    setCurrentTime(event.target.getCurrentTime());
  };

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div
      className="flex gap-5 flex-col sm:flex-row w-full sm:w-5/6 py-3 px-7 rounded-lg justify-between items-center sm:absolute bottom-4 h-fit"
      style={{ background: `rgba(${color}, 0.7)` }}
    >
      <YouTube
        videoId={video.id.videoId}
        opts={YT_OPTS}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnd={() => {
          setPlaying(false);
          nextVideo();
        }}
        onError={(e) => console.log("Erro: ", e)}
      />

      <div className="flex gap-3 items-center">
        <BsFillSkipStartFill
          size={20}
          style={{ cursor: "pointer" }}
          onClick={prevVideo}
        />
        {!playing ? (
          <BsFillPlayCircleFill
            onClick={() => playerRef.current?.playVideo()}
            size={50}
            style={{ cursor: playerReady ? "pointer" : "default", opacity: playerReady ? 1 : 0.5 }}
          />
        ) : (
          <BsPauseCircleFill
            onClick={() => playerRef.current?.pauseVideo()}
            size={50}
            style={{ cursor: "pointer" }}
          />
        )}
        <BsFillSkipEndFill
          size={20}
          style={{ cursor: "pointer" }}
          onClick={nextVideo}
        />
      </div>

      <div className="flex gap-2 items-center justify-center">
        <img
          src={video.snippet.thumbnails.medium.url}
          alt="video thumbnail"
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold">{video.snippet.title}</h2>
          <p className="text-xs">{video.snippet.channelTitle}</p>
        </div>
      </div>

      <AiFillHeart
        size={40}
        color={isFavorite ? "#FF2255" : "#FFF"}
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (isFavorite) {
            removeFavoriteVideo(video.id.videoId);
          } else {
            addFavoriteVideo(video);
          }
        }}
      />

      <div className="flex gap-2 w-full items-center mx-10">
        <span className="text-sm font-bold">
          {Math.floor(currentTime / 60)}:
          {String(Math.floor(currentTime % 60)).padStart(2, "0")}
        </span>
        <div className="w-full h-1 bg-gray-300 rounded-lg">
          <div
            className="h-full rounded-lg"
            style={{ width: `${progress}%`, background: "#ee82ee" }}
          />
        </div>
        <span className="text-sm font-bold">
          {Math.floor(totalTime / 60)}:
          {String(Math.floor(totalTime % 60)).padStart(2, "0")}
        </span>
      </div>

      <div className="gap-3 items-center hidden sm:flex">
        <BsShuffle
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => setShuffle(!shuffle)}
          color={shuffle ? "black" : "white"}
        />
        {volume === 0 ? (
          <BsFillVolumeMuteFill
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setVolume(100);
              playerRef.current?.setVolume(100);
            }}
            color="white"
          />
        ) : (
          <BsFillVolumeUpFill
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setVolume(0);
              playerRef.current?.setVolume(0);
            }}
            color="white"
          />
        )}
      </div>
    </div>
  );
};

export default Player;
