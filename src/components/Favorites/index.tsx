import { useColor } from "@/hooks/useColor";
import { usePlaylist } from "@/hooks/usePlaylist";

export const Favorites = () => {
  const { favoriteVideos, setVideo, actualVideo } = usePlaylist();
  const { color } = useColor();

  return (
    <div className="flex flex-col items-start justify-start gap-4 w-full sm:w-fit max-h-screen h-screen  bg-slate-800/90 p-4">
      <h1 className="text-2xl font-bold whitespace-nowrap">Seus favoritos</h1>
      <div className="flex justify-start items-start flex-col gap-8 max-w-sm mt-6 max-h-fit overflow-y-auto overflow-x-hidden pr-4">
        {favoriteVideos.map((video) => (
          <div
            key={video.id.videoId}
            className="flex  items-start justify-start cursor-pointer gap-3  w-full hover:bg-gray-400/50 p-3 rounded-lg"
            onClick={() => setVideo(video)}
            style={
              actualVideo?.id.videoId === video.id.videoId
                ? {
                    backgroundColor: `rgba(${color}, 0.5)`,
                  }
                : {}
            }
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

      {favoriteVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-sm font-bold">Nenhuma musica favorita ainda</h2>
        </div>
      )}
    </div>
  );
};
