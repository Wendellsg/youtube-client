import { SiDiscogs } from "react-icons/si";

import { FaSearch } from "react-icons/fa";
import { AiFillSetting, AiFillHeart } from "react-icons/ai";
import { IoMusicalNotes } from "react-icons/io5";
import { useState } from "react";
import { Search } from "../Search";
import { Playlist } from "../Playlist";
import { useColor } from "@/hooks/useColor";
import { Favorites } from "../Favorites";
import { usePlaylist } from "@/hooks/usePlaylist";

export const SideBar = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const { color } = useColor();
  const { addingNewVideo } = usePlaylist();

  const Tab = () => {
    switch (selectedTab) {
      case "search":
        return <Search />;
      case "favorites":
        return <Favorites />;
      case "playlist":
        return <Playlist />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex sm:flex-col w-full sm:w-fit items-center justify-between relative p-6 bg-slate-800/90 sm:h-screen">
        <SiDiscogs size={40} color={`#ee82ee`} className="h-0 sm:h-10" />

        <div className="flex sm:flex-col gap-6 ">
          <FaSearch
            size={25}
            style={{
              cursor: "pointer",
              color: selectedTab === "search" ? `rgb(${color})` : "gray",
            }}
            onClick={() => {
              if (selectedTab === "search") {
                setSelectedTab("");
                return;
              }

              setSelectedTab("search");
            }}
          />
          <IoMusicalNotes
            size={25}
            style={{
              cursor: "pointer",
              color: addingNewVideo
                ? "#ee82ee"
                : selectedTab === "playlist"
                ? `rgb(${color})`
                : "gray",
            }}
            onClick={() => {
              if (selectedTab === "playlist") {
                setSelectedTab("");
                return;
              }

              setSelectedTab("playlist");
            }}
          />
          <AiFillHeart
            size={25}
            style={{
              cursor: "pointer",
              color: selectedTab === "favorites" ? `rgb(${color})` : "gray",
            }}
            onClick={() => {
              if (selectedTab === "favorites") {
                setSelectedTab("");
                return;
              }

              setSelectedTab("favorites");
            }}
          />
        </div>
        <AiFillSetting size={25} className="h-0 sm:h-10" />
      </div>

      {Tab()}
    </>
  );
};
