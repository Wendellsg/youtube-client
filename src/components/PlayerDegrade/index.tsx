import { useColor } from "@/hooks/useColor";
import { useEffect, useState } from "react";

export const PlayerDegrade: React.FC<{
}> = () => {
  const { color } = useColor();

  return (
    <div
      className="absolute"
      style={{
        width: "100%",
        height: "100%",
        background: `radial-gradient(rgba(${color},0.3) 0%, rgba(255,255,255,0) 50%)`,
        zIndex: -1,
        filter: "blur(10px)",
      }}
    />
  );
};
