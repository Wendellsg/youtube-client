import { usePlaylist } from "@/hooks/usePlaylist";

export const Playlist = () => {
  const { playList, setVideo } = usePlaylist();

  return (
    <div className="flex flex-col items-start justify-start gap-4 w-fit max-h-screen h-screen  bg-slate-800/90 p-4">
      <h1 className="text-2xl font-bold">Playlist atual</h1>
      <div className="flex justify-start items-start flex-col gap-2 max-w-sm mt-6 max-h-fit overflow-y-auto overflow-x-hidden pr-4">
        {playList.map((video) => (
          <div
            key={video.id.videoId}
            className="flex  items-center justify-center cursor-pointer gap-3"
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
      </div>
    </div>
  );
};
