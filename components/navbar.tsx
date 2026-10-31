"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/components/contexts/gameContext";

export default function NavBar() {
  const { isJoined } = useGame();
  const pathname = usePathname();

  if (isJoined || pathname.startsWith("/game/")) {
    return null;
  }

  return (
    <div className="absolute left-10 top-10 z-10 flex h-dvh">
      <div className="flex h-[10dvh] flex-col items-center justify-evenly gap-1.5 rounded-sm bg-white p-1 font-semibold text-black">
        <Link className="hover:text-blue-500" href={"/"}>Home</Link>
        <Link className="hover:text-blue-500" href={"/profile"}>Profile</Link>
      </div>
    </div>
  );
}
