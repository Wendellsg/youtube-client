/* eslint-disable @next/next/no-img-element */
import { useColor } from "@/hooks/useColor";
import { usePlaylist } from "@/hooks/usePlaylist";

export const Playlist = () => {
  const { playList, setVideo, actualVideo } = usePlaylist();
  const { color } = useColor();

  console.log(actualVideo);

  return (
    <div className="flex flex-col items-start justify-start gap-4 w-full sm:w-fit max-h-screen h-screen  bg-slate-800/90 p-4">
      <h1 className="text-2xl font-bold  whitespace-nowrap">Playlist atual</h1>
      <div className="flex justify-start items-start flex-col gap-8 max-w-sm mt-6 max-h-fit overflow-y-auto overflow-x-hidden pr-4">
        {playList.map((video) => (
          <div
            key={video.id.videoId}
            className={`flex items-start justify-start cursor-pointer gap-3 hover:bg-gray-400/50 p-3 rounded-lg  w-full`}
            style={
              actualVideo?.id.videoId === video.id.videoId
                ? {
                    backgroundColor: `rgba(${color}, 0.5)`,
                  }
                : {}
            }
            onClick={() => setVideo(video)}
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              width={80}
              height={80}
              className="rounded-md object-cover w-20 h-20"
            />
            <div className="flex flex-col gap-1 justify-start">
              <h2 className="text-xs font-bold">{video.snippet.title}</h2>
              <p className="text-xs">{video.snippet.channelTitle}</p>
            </div>
          </div>
        ))}

        {playList.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-sm font-bold">Nenhuma música na playlist</h2>
          </div>
        )}
      </div>
    </div>
  );
};
