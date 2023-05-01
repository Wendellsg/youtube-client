/* eslint-disable @next/next/no-img-element */
import { usePlaylist } from "@/hooks/usePlaylist";
import { useYoutube } from "@/hooks/useYoutube";
import { FaSearch } from "react-icons/fa";

export const Search = () => {
  const { fetchVideos, videos, search, setSearch } = useYoutube();

  const { addVideo } = usePlaylist();

  return (
    <div className="flex flex-col items-start justify-start gap-4 w-fit max-h-screen h-screen  bg-slate-800/90 p-4">
      <div className="flex gap-3 items-center mt-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 p-2 border-2 rounded-md  text-black outline-none shadow-md text-sm"
          placeholder="Pesquise por uma música ou artista"
        />

        <FaSearch
          onClick={fetchVideos}
          size={20}
          style={{
            cursor: "pointer",
          }}
        />
      </div>

      <div className="flex justify-start items-start flex-col gap-2 max-w-sm mt-6 max-h-fit overflow-y-auto overflow-x-hidden pr-4">
        {videos.map((video) => (
          <div
            key={video.id.videoId}
            className="flex  items-center justify-center cursor-pointer gap-3"
            onClick={() => addVideo(video)}
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
