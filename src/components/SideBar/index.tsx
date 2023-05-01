import { SiDiscogs } from "react-icons/si";

import { FaSearch } from "react-icons/fa";
import { AiFillSetting, AiFillHeart } from "react-icons/ai";
import { IoMusicalNotes } from "react-icons/io5";
import { useState } from "react";
import { Search } from "../Search";
import { Playlist } from "../Playlist";

export const SideBar = () => {
  const [selectedTab, setSelectedTab] = useState("");

  const Tab = () => {
    switch (selectedTab) {
      case "search":
        return <Search />;
      case "favorites":
        return <h1>Favorites</h1>;
      case "playlist":
        return <Playlist />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-between relative p-6 bg-slate-800/90 h-screen">
        <SiDiscogs size={40} color="violet" />

        <div className="flex flex-col gap-6">
          <FaSearch
            size={20}
            style={{
              cursor: "pointer",
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
            size={20}
            style={{
              cursor: "pointer",
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
            size={20}
            style={{
              cursor: "pointer",
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
        <AiFillSetting size={20} />
      </div>

      {Tab()}
    </>
  );
};
