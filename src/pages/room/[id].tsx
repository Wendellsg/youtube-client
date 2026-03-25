/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useJam } from "@/hooks/useJam";
import { usePlaylist } from "@/hooks/usePlaylist";
import { useColor } from "@/hooks/useColor";
import { PlayerDegrade } from "@/components/PlayerDegrade";
import Player from "@/components/Player";
import { VideoItem } from "@/types";
import { MdContentCopy, MdCheck, MdArrowBack, MdDragHandle } from "react-icons/md";
import { SiDiscogs } from "react-icons/si";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const inter = Inter({ subsets: ["latin"] });

const RoomSortableItem = ({
  video,
  isActive,
  color,
  onPlay,
  onRemove,
}: {
  video: VideoItem;
  isActive: boolean;
  color: string;
  onPlay: () => void;
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: video.id.videoId });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        backgroundColor: isActive ? `rgba(${color}, 0.2)` : undefined,
      }}
      className="flex items-center gap-1 p-2 rounded-md group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-600 hover:text-gray-300 cursor-grab active:cursor-grabbing shrink-0"
        tabIndex={-1}
      >
        <MdDragHandle size={16} />
      </button>
      <img
        src={video.snippet.thumbnails.default.url}
        alt={video.snippet.title}
        className="w-10 h-10 rounded object-cover shrink-0 cursor-pointer"
        onClick={onPlay}
      />
      <div className="flex flex-col flex-1 min-w-0 cursor-pointer" onClick={onPlay}>
        <span
          className="text-xs font-semibold truncate"
          style={{ color: isActive ? `rgb(${color})` : "white" }}
        >
          {video.snippet.title}
        </span>
        <span className="text-xs text-gray-400 truncate">{video.snippet.channelTitle}</span>
        {video.addedBy && (
          <span className="text-xs text-violet-400 truncate">por {video.addedBy}</span>
        )}
      </div>
      <button
        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 text-xs"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
      >
        ✕
      </button>
    </div>
  );
};

export default function RoomPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { roomId, joinRoom, leaveRoom } = useJam();
  const { playList, addVideo, actualVideo, setVideo, removeVideo, reorderPlaylist } = usePlaylist();
  const { color } = useColor();
  const sensors = useSensors(useSensor(PointerSensor));

  const initialized = useRef(false);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [roomError, setRoomError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  // Debounced search (min 3 chars, 500ms)
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `/api/youtube/search?q=${encodeURIComponent(searchQuery)}&maxResults=10`
        );
        setSearchResults(data.items);
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Join room on mount
  useEffect(() => {
    if (!id || initialized.current) return;
    initialized.current = true;

    if (roomId === id) {
      setLoadingRoom(false);
      return;
    }

    joinRoom(id)
      .then(({ playlist }) => {
        if (playlist.length > 0 && !actualVideo) {
          setVideo(playlist[0]);
        }
        setLoadingRoom(false);
      })
      .catch(() => {
        setRoomError("Sala não encontrada ou expirada.");
        setLoadingRoom(false);
      });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddVideo = (video: VideoItem) => {
    addVideo(video);
    setSearchResults((prev) => prev.filter((v) => v.id.videoId !== video.id.videoId));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    leaveRoom();
    router.push("/");
  };

  if (loadingRoom) {
    return (
      <main className={`flex min-h-screen items-center justify-center ${inter.className}`}>
        <div className="flex flex-col items-center gap-3">
          <SiDiscogs size={50} color="violet" className="animate-spin" />
          <p className="text-gray-400 text-sm">Entrando na sala...</p>
        </div>
      </main>
    );
  }

  if (roomError) {
    return (
      <main className={`flex min-h-screen items-center justify-center ${inter.className}`}>
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-400 font-semibold">{roomError}</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            <MdArrowBack size={16} /> Voltar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`flex min-h-screen h-full items-center justify-start gap-3 ${inter.className} sm:flex-row flex-col`}>

      {/* Sidebar */}
      <div className="flex flex-col w-full sm:w-72 min-h-screen bg-slate-800/90 shrink-0">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <SiDiscogs size={22} color="#ee82ee" />
            <span className="font-bold text-sm text-white">Jam Session</span>
          </div>
          <button
            onClick={handleLeave}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Sair da sala"
          >
            <MdArrowBack size={18} />
          </button>
        </div>

        {/* Room code */}
        <div className="flex flex-col gap-1 p-4 border-b border-slate-700">
          <span className="text-gray-400 text-xs">Código da sala</span>
          <div className="flex items-center gap-2 bg-slate-700 rounded-md px-3 py-2">
            <span
              className="font-mono font-bold text-base flex-1 tracking-widest"
              style={{ color: `rgb(${color})` }}
            >
              {id}
            </span>
            <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
              {copied ? <MdCheck size={16} className="text-green-400" /> : <MdContentCopy size={16} />}
            </button>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: `rgb(${color})` }}
            />
            <span className="text-gray-500 text-xs">Sincronizando a cada 3s</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-2 p-4 border-b border-slate-700">
          <div className="flex gap-2 items-center bg-slate-700 rounded-md px-3 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Adicionar música..."
              className="bg-transparent text-white text-sm flex-1 outline-none placeholder:text-gray-500"
            />
            {searching && (
              <span className="text-gray-500 text-xs animate-pulse">...</span>
            )}
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-56">
            {searchResults.map((video) => (
              <div
                key={video.id.videoId}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-2 rounded-md group"
                onClick={() => handleAddVideo(video)}
              >
                <img
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                  className="w-10 h-10 rounded object-cover shrink-0"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-white truncate">{video.snippet.title}</span>
                  <span className="text-xs text-gray-400 truncate">{video.snippet.channelTitle}</span>
                </div>
                <span
                  className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  style={{ color: `rgb(${color})` }}
                >
                  +
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Playlist */}
        <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-1">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Playlist ({playList.length})
          </span>
          {playList.length === 0 && (
            <p className="text-gray-500 text-xs mt-2">Nenhuma música ainda. Adicione a primeira!</p>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event: DragEndEvent) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              const oldIndex = playList.findIndex((v) => v.id.videoId === active.id);
              const newIndex = playList.findIndex((v) => v.id.videoId === over.id);
              reorderPlaylist(oldIndex, newIndex);
            }}
          >
            <SortableContext
              items={playList.map((v) => v.id.videoId)}
              strategy={verticalListSortingStrategy}
            >
              {playList.map((video) => (
                <RoomSortableItem
                  key={video.id.videoId}
                  video={video}
                  isActive={actualVideo?.id.videoId === video.id.videoId}
                  color={color}
                  onPlay={() => setVideo(video)}
                  onRemove={() => removeVideo(video)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Player area */}
      {actualVideo ? (
        <div className="flex flex-col items-center justify-center sm:w-full min-h-screen relative p-4 w-5/6">
          <PlayerDegrade />
          <img
            src={actualVideo.snippet.thumbnails.high.url}
            alt={actualVideo.snippet.title}
            className="hidden sm:flex w-96 h-96 rounded-md object-cover"
          />
          <Player video={actualVideo} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full min-h-screen relative p-4 gap-2">
          <SiDiscogs size={80} color="violet" />
          <h2 className="text-xl font-bold text-center mt-4">
            Adicione a primeira música à <span className="text-pink-400">Jam</span>
          </h2>
        </div>
      )}
    </main>
  );
}
