import { useEffect, useState } from "react";
//@ts-ignore-next-line
import ColorThief from "colorthief";

export const PlayerDegrade: React.FC<{
  thumbnail: string;
}> = ({ thumbnail }) => {
  const [color, setColor] = useState("rgba(238, 130, 238, 0.3)");

  useEffect(() => {
    const colorThief = new ColorThief();
    const img = new Image();
    img.src = thumbnail;
    img.crossOrigin = "Anonymous";

    img.addEventListener("load", () => {
      const color = colorThief.getColor(img);
      setColor(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`);
    });
  }, [thumbnail]);

  return (
    <div
      className="absolute"
      style={{
        width: "100%",
        height: "100%",
        background: `radial-gradient(${color} 0%, rgba(255,255,255,0) 50%)`,
        zIndex: -1,
        filter: "blur(10px)",
      }}
    />
  );
};
