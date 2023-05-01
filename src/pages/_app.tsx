import { usePlaylist } from "@/hooks/usePlaylist";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { getFavoriteVideos } = usePlaylist();

  useEffect(() => {
    getFavoriteVideos();
  }, []);

  return <Component {...pageProps} />;
}
