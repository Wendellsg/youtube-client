/* eslint-disable @next/next/no-img-element */
import { usePlaylist } from "@/hooks/usePlaylist";
import { useYoutube } from "@/hooks/useYoutube";
import { FaSearch } from "react-icons/fa";

export const Search = () => {
  const { fetchVideos, videos, search, setSearch, setVideos } = useYoutube();

  const { addVideo } = usePlaylist();

  return (
    <div className="flex flex-col items-start justify-start gap-4 max-h-screen h-screen  bg-slate-800/90 p-4">
      <div className="flex gap-3 items-center mt-4 w-full p-4 rounded-md  text-black outline-none shadow-md text-sm  bg-gray-400/60">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-white"
          placeholder="Pesquise por uma música ou artista"
        />
        <FaSearch
          onClick={fetchVideos}
          size={20}
          style={{
            cursor: "pointer",
          }}
          color="#FFF"
        />
      </div>

      <div className="flex justify-start items-start flex-col gap-8 max-w-sm mt-6 max-h-fit overflow-y-auto overflow-x-hidden pr-4">
        {videos.map((video) => (
          <div
            key={video.id.videoId}
            className="flex items-start justify-start cursor-pointer gap-3 w-full hover:bg-gray-400/50 p-3 rounded-lg"
            onClick={() => {
              addVideo(video);
              setVideos((prevVideos) =>
                prevVideos.filter(
                  (prevVideo) => prevVideo.id.videoId !== video.id.videoId
                )
              );
            }}
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
