/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
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

const Player: React.FC<{
  video: VideoItem;
}> = ({ video }) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
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

  const progress = (currentTime / totalTime) * 100;

  const isFavorite = favoriteVideos.find(
    (favoriteVideo) => favoriteVideo.id.videoId === video.id.videoId
  );

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event.target);
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    // faz algo quando o estado do player mudar
    if (event.data === 1) {
      setTotalTime(player.getDuration());
    }
    setCurrentTime(player.getCurrentTime());
  };

  const playVideo = () => {
    player.playVideo();
  };

  const pauseVideo = () => {
    player.pauseVideo();
  };

  const stopVideo = () => {
    player.stopVideo();
  };

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      // insira aqui suas variáveis ​​de player do YouTube
      autoplay: 1,
    },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (player && playing) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, playing]);

  return (
    <div
      className="flex gap-5 flex-col sm:flex-row w-full sm:w-5/6 py-3 px-7 rounded-lg justify-between items-center absolute bottom-4 h-full sm:h-fit"
      style={{
        background: `rgba(${color}, 0.5)`,
      }}
    >
      <YouTube
        videoId={video.id.videoId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnd={() => {
          setPlaying(false);
          nextVideo();
        }}
        onError={(e) => console.log("Erro: ", e)}
        onPlaybackRateChange={(e) =>
          console.log("Velocidade de reprodução: ", e)
        }
        onPlaybackQualityChange={(e) =>
          console.log("Qualidade de reprodução: ", e)
        }
      />

      <div className="flex gap-3 items-center">
        <BsFillSkipStartFill
          size={20}
          style={{ cursor: "pointer" }}
          onClick={prevVideo}
        />
        {!playing ? (
          <BsFillPlayCircleFill
            onClick={playVideo}
            size={50}
            style={{
              cursor: "pointer",
            }}
          />
        ) : (
          <BsPauseCircleFill
            onClick={pauseVideo}
            size={50}
            style={{
              cursor: "pointer",
            }}
          />
        )}
        <BsFillSkipEndFill
          size={20}
          style={{ cursor: "pointer" }}
          onClick={nextVideo}
        />
      </div>

      <div className="hidden gap-2 items-center justify-center sm:flex">
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
          {Math.floor(currentTime % 60) < 10
            ? `0${Math.floor(currentTime % 60)}`
            : Math.floor(currentTime % 60)}
        </span>

        <div className="w-full h-1 bg-gray-300 rounded-lg">
          <div
            className="h-full rounded-lg"
            style={{ width: `${progress}%`, background: "#ee82ee" }}
          />
        </div>
        <span className="text-sm font-bold">
          {Math.floor(totalTime / 60)}:
          {Math.floor(totalTime % 60) < 10
            ? `0${Math.floor(totalTime % 60)}`
            : Math.floor(totalTime % 60)}
        </span>
      </div>
      <div className="flex gap-3 items-center">
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
              player?.setVolume(100);
            }}
            color={"white"}
          />
        ) : (
          <BsFillVolumeUpFill
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setVolume(0);
              player?.setVolume(100);
            }}
            color={"white"}
          />
        )}
      </div>
    </div>
  );
};

export default Player;
