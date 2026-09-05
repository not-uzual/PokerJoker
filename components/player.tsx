import Image from "next/image";
import dealtCard from "@/public/PocketCard.png"

type PlayerProps = {
  x: number;
  y: number;
  name?: string;
  isOccupied: boolean;
  isActive: boolean;
  isDealer: boolean;
};

export default function Player({
  x,
  y,
  name,
  isOccupied,
  isActive,
  isDealer,
}: PlayerProps) {
  return (
    <div
      className={`absolute z-10 flex size-20 justify-center rounded-full border-4 ${
        isActive
          ? "border-green-400 bg-green-500"
          : isOccupied
            ? "border-white bg-white"
            : "border-zinc-500 bg-zinc-700"
      }`}
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      {isOccupied && (
        <Image
          src={dealtCard}
          alt=""
          className="relative size-15 self-end -bottom-2"
        />
      )}
      <span className="absolute -bottom-6 max-w-28 truncate text-xs font-bold text-white">
        {name ?? "Empty"}
      </span>
      {isDealer && <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-white text-xs font-black text-black">D</span>}
    </div>
  );
}
