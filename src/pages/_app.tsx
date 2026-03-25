import { usePlaylist } from "@/hooks/usePlaylist";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { UsernameGuard } from "@/components/UsernameGuard";

export default function App({ Component, pageProps }: AppProps) {
  const { getFavoriteVideos } = usePlaylist();

  useEffect(() => {
    getFavoriteVideos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UsernameGuard>
      <Component {...pageProps} />
    </UsernameGuard>
  );
}
