"use client"

import PokerGame from "@/components/poker";
import { useParams } from "next/navigation";


export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <>
      <PokerGame roomId={roomId} />
    </>
  );
}
