/* eslint-disable @next/next/no-img-element */
import { useColor } from "@/hooks/useColor";
import { usePlaylist } from "@/hooks/usePlaylist";
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
import { VideoItem } from "@/types";
import { MdDragHandle } from "react-icons/md";

const SortableItem = ({
  video,
  isActive,
  color,
  onClick,
}: {
  video: VideoItem;
  isActive: boolean;
  color: string;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id.videoId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    backgroundColor: isActive ? `rgba(${color}, 0.5)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start justify-start gap-2 p-3 rounded-lg w-full group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing mt-1 shrink-0"
        tabIndex={-1}
      >
        <MdDragHandle size={18} />
      </button>

      <div
        className="flex items-start gap-3 flex-1 cursor-pointer hover:bg-gray-400/20 rounded-md p-1"
        onClick={onClick}
      >
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          width={80}
          height={80}
          className="rounded-md object-cover w-16 h-16"
        />
        <div className="flex flex-col gap-1 justify-start">
          <h2 className="text-xs font-bold">{video.snippet.title}</h2>
          <p className="text-xs">{video.snippet.channelTitle}</p>
          {video.addedBy && (
            <p className="text-xs text-violet-400">por {video.addedBy}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const Playlist = () => {
  const { playList, setVideo, actualVideo, reorderPlaylist } = usePlaylist();
  const { color } = useColor();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = playList.findIndex((v) => v.id.videoId === active.id);
    const newIndex = playList.findIndex((v) => v.id.videoId === over.id);
    reorderPlaylist(oldIndex, newIndex);
  };

  return (
    <div className="flex flex-col items-start justify-start gap-4 w-full sm:w-fit max-h-screen h-screen bg-slate-800/90 p-4">
      <h1 className="text-2xl font-bold whitespace-nowrap">Playlist atual</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={playList.map((v) => v.id.videoId)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex justify-start items-start flex-col gap-2 max-w-sm mt-2 max-h-fit overflow-y-auto overflow-x-hidden pr-2">
            {playList.map((video) => (
              <SortableItem
                key={video.id.videoId}
                video={video}
                isActive={actualVideo?.id.videoId === video.id.videoId}
                color={color}
                onClick={() => setVideo(video)}
              />
            ))}

            {playList.length === 0 && (
              <p className="text-sm font-bold">Nenhuma música na playlist</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
