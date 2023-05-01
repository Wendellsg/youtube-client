/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";
import Player from "@/components/Player";
import { SideBar } from "@/components/SideBar";
import { usePlaylist } from "@/hooks/usePlaylist";
import { SiDiscogs } from "react-icons/si";
import { PlayerDegrade } from "@/components/PlayerDegrade";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { actualVideo } = usePlaylist();

  return (
    <main
      className={`flex min-h-screen h-full items-center justify-start gap-3 ${inter.className}`}
    >
      <SideBar />
      {actualVideo && (
        <div className="flex flex-col items-center justify-center w-full min-h-screen relative p-4">
          <PlayerDegrade thumbnail={actualVideo.snippet.thumbnails.default.url}/>
          <img
            src={actualVideo.snippet.thumbnails.high.url}
            alt={actualVideo.snippet.title}
            className="w-96 h-96 rounded-md object-cover self-center"
          />
          <Player video={actualVideo} />
        </div>
      )}

      {!actualVideo && (
        <div className="flex flex-col items-center justify-center w-full min-h-screen relative p-4 gap-2">
          <SiDiscogs size={100} color="violet" />
          <h1 className="text-2xl font-bold text-center mt-5">
            Bem vindo ao{" "}
            <span className="text-violet-300">Musica Sem Firula</span>
          </h1>
          <h2 className="text-1xl font-bold text-center">
            Para começar, pesquise por uma música ou artista
          </h2>
        </div>
      )}
    </main>
  );
}
