/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { YouTubeEvent } from "react-youtube";
import {
  BsFillPlayCircleFill,
  BsPauseCircleFill,
  BsFillSkipEndFill,
  BsFillSkipStartFill,
} from "react-icons/bs";
import { VideoItem } from "@/types";
import { useColor } from "@/hooks/useColor";
import { usePlaylist } from "@/hooks/usePlaylist";

const Player: React.FC<{
  video: VideoItem;
}> = ({ video }) => {
  const [player, setPlayer] = useState<YouTubeEvent["target"] | null>(null);
  const [playing, setPlaying] = useState(false);
  const { color } = useColor();
  const { nextVideo, prevVideo } = usePlaylist();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const progress = (currentTime / totalTime) * 100;

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
    if (player) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player]);

  return (
    <div
      className="flex gap-3 w-5/6 p-3 rounded-lg items-center absolute bottom-4"
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
        onEnd={() => setPlaying(false)}
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
          size={30}
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
          size={30}
          style={{ cursor: "pointer" }}
          onClick={nextVideo}
        />
      </div>

      <img
        src={video.snippet.thumbnails.medium.url}
        alt="video thumbnail"
        className="w-20 h-20 rounded-lg object-cover"
      />

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">{video.snippet.title}</h2>
        <p className="text-xs">{video.snippet.channelTitle}</p>
      </div>

      <div className="flex gap-2 w-full items-center">
        <span className="text-sm font-bold">
          {Math.floor(currentTime / 60)}:
          {Math.floor(currentTime % 60) < 10
            ? `0${Math.floor(currentTime % 60)}`
            : Math.floor(currentTime % 60)}
        </span>

        <div className="w-full h-1 bg-gray-300 rounded-lg">
          <div
            className="h-full bg-green-500 rounded-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-bold">
          {Math.floor(totalTime / 60)}:
          {Math.floor(totalTime % 60) < 10
            ? `0${Math.floor(totalTime % 60)}`
            : Math.floor(totalTime % 60)}
        </span>
      </div>
    </div>
  );
};

export default Player;
