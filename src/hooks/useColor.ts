import { useAtom } from "jotai";
//@ts-ignore-next-line
import ColorThief from "colorthief";
import { colorAtom } from "./states";
export const useColor = () => {
  const [color, setColor] = useAtom(colorAtom);

  const getColor = (image: string) => {
    const colorThief = new ColorThief();
    const img = new Image();
    let imageURL = image;
    let googleProxyURL =
      "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=";

    img.crossOrigin = "Anonymous";
    img.src = googleProxyURL + encodeURIComponent(imageURL);

    img.addEventListener("load", () => {
      const color = colorThief.getColor(img);
      setColor(`${color[0]}, ${color[1]}, ${color[2]}`);
    });
  };

  return { getColor, color };
};
