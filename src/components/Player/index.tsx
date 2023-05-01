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

const Player: React.FC<{
  video: VideoItem;
}> = ({ video }) => {
  const [player, setPlayer] = useState<YouTubeEvent["target"] | null>(null);
  const [playing, setPlaying] = useState(false);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event.target);
    event.target.playVideo();
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    // faz algo quando o estado do player mudar
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
    },
  };


  return (
    <div className="flex gap-3 w-5/6 bg-slate-400/30 p-3 rounded-lg items-center absolute bottom-4">
      <YouTube
        videoId={video.id.videoId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnd={() => console.log("Video finalizado")}
        onError={(e) => console.log("Erro: ", e)}
        onPlaybackRateChange={(e) =>
          console.log("Velocidade de reprodução: ", e)
        }
        onPlaybackQualityChange={(e) =>
          console.log("Qualidade de reprodução: ", e)
        }
      />

      <div className="flex gap-3 items-center">
        <BsFillSkipStartFill size={30} style={{ cursor: "pointer" }} />
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
        <BsFillSkipEndFill size={30} style={{ cursor: "pointer" }} />
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
    </div>
  );
};

export default Player;
