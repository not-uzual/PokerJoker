"use client";

import Image from "next/image";
import { useGame } from "@/components/contexts/gameContext";
import {
  getPlayerId,
  getPlayerRoomData,
  savePlayerRoomData,
} from "@/lib/player";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RoomPlayer = {
  playerId: string;
  name: string;
};

type Room = {
  id: string;
  name: string;
  host: string;
  players: RoomPlayer[];
  maxPlayers: number;
  status: "lobby" | "starting" | "in-progress" | "finished";
};

type AliceCard = {
  suit: "H" | "D" | "C" | "S";
  rank: "11" | "12" | "13" | "14";
};

const aliceCards: AliceCard[] = (["H", "D", "C", "S"] as const).flatMap(
  (suit) =>
    (["11", "12", "13", "14"] as const).map((rank) => ({ suit, rank })),
);

function aliceCardSource(card: AliceCard): string {
  return `/Alice52Deck/${card.suit}${card.rank}.png`;
}

function drawDifferentAliceCard(currentCard: AliceCard): AliceCard {
  const otherCards = aliceCards.filter(
    (card) => card.suit !== currentCard.suit || card.rank !== currentCard.rank,
  );
  return otherCards[Math.floor(Math.random() * otherCards.length)];
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);
  const [joinName, setJoinName] = useState("");
  const [hoverCard, setHoverCard] = useState<AliceCard>(aliceCards[0]);

  const {isJoined, setIsJoined} = useGame();

  const router = useRouter();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHoverCard(aliceCards[Math.floor(Math.random() * aliceCards.length)]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const playerId = getPlayerId();

    socket.emit("register-player", {
      playerId,
    });

    const handleRoomJoined = ({ room }: { room: Room }) => {
      const currentPlayer = room.players.find(
        (player: { playerId: string }) => player.playerId === playerId,
      );

      savePlayerRoomData({
        hostId: room.host,
        hostName: currentPlayer?.name ?? "",
        roomId: room.id,
        roomName: room.name,
        players: room.players,
      });
      router.push(`/game/${room.id}`);
    };

    socket.on("room-joined", handleRoomJoined);
    return () => {
      socket.off("room-joined", handleRoomJoined);
    };
  }, []);

  useEffect(() => {
    const playerRoomData = getPlayerRoomData();

    if (playerRoomData && isJoined) {
      const rejoin = setTimeout(() => {
        router.push(`/game/${playerRoomData.roomId}`);
      }, 2000);

      return () => clearTimeout(rejoin);
    }
  }, [isJoined, router]);

  useEffect(() => {
    const handleRooms = (room: Room[]) => {
      setRooms(room);
    };
    const playerId = getPlayerId();
    const filteredRoom = rooms.filter((room) => room.host === playerId);
    const currentPlayerData = filteredRoom[0]?.players?.filter(
      (player: { playerId: string }) => playerId === player.playerId,
    );

    socket.on("rooms-updated", handleRooms);

    if (!filteredRoom[0]) {
      return () => socket.off("rooms-updated", handleRooms);
    }

    const playerRoomData = {
      hostId: filteredRoom[0].host,
      hostName: currentPlayerData[0].name,
      roomId: filteredRoom[0].id,
      roomName: filteredRoom[0].name,
      players: filteredRoom[0].players,
      isJoined: true
    };

    savePlayerRoomData(playerRoomData);

    return () => {
      socket.off("rooms-updated", handleRooms);
    };
  }, [rooms, setRooms]);

  function handleSubmit() {
    
    if(roomName.trim()=== "" && name.trim() === "") {
      alert("Only characters and numbers are accepted!");
      return;
    }

    const data = {
      name: roomName,
      playerId: getPlayerId(),
      playerName: name,
    };
    socket.emit("create-room", data);

    setIsJoined(true);
    setName("");
    setRoomName("");
  }

  function joinRoom(room: Room) {
    if (joiningRoomId !== room.id) {
      setJoiningRoomId(room.id);
      setJoinName("");
      return;
    }

    if (joinName.trim() === "") {
      alert("Only characters and numbers are accepted!");
      return;
    }
    
    const playerName = joinName.trim().toLowerCase();
    const isValid = /^[A-Za-z0-9]+$/.test(playerName);

    if(!isValid) {
      alert("Only characters and numbers are accepted!");
      return;
    }
    
    const player = room.players.find(player => player.name.toLowerCase() === playerName);
    if(player?.name) {
      alert(`Enter unique name. Player of name ${player.name} already present!`);
      setJoinName("");
      return;
    }

    socket.emit("join-room", {
      roomId: room.id,
      playerId: getPlayerId(),
      playerName: joinName.trim(),
    });
    setIsJoined(true)
  }

  if (isJoined) {
    return (
      <>
        <div className="flex-1 flex justify-center text-white">
          <div className="h-15 w-75 bg-red-500/30 text-center border-2 border-white">
            <p>
              You are not allowed to leave room. Redirecting...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 flex justify-center text-black">
        <div className="h-150 w-200 flex flex-col items-center bg-white gap-2.5 py-2 rounded-lg">
          <div className="flex flex-col items-center gap-1">
            <p className="font-joker text-6xl text-purple-600 ">pokerjoker</p>
            <span
              role="button"
              tabIndex={0}
              aria-label="Draw a random card"
              className="z-20 block cursor-pointer"
              onMouseEnter={() =>
                setHoverCard((currentCard) =>
                  drawDifferentAliceCard(currentCard),
                )
              }
              onFocus={() =>
                setHoverCard((currentCard) =>
                  drawDifferentAliceCard(currentCard),
                )
              }
            >
              <Image
                src={aliceCardSource(hoverCard)}
                alt={`${hoverCard.rank} of ${hoverCard.suit}`}
                width={96}
                height={144}
                className="h-36 w-24 object-contain shadow-2xl"
                onMouseEnter={() =>
                  setHoverCard((currentCard) =>
                    drawDifferentAliceCard(currentCard),
                  )
                }
              />
            </span>
          </div>

          <div className="flex h-fit w-fit items-start justify-center gap-4 px-4 py-4 border-t-4 border-purple-600">
            <div className="flex w-60 shrink-0 flex-col items-center justify-center gap-2.5 border-2 py-2 rounded-lg">
              <p className="text-xl font-semibold">Create Room</p>
              <input
                type="text"
                name=""
                id=""
                placeholder="Room Name"
                className="w-50 border-2 px-2 focus:border-purple-800 focus:outline-none"
                onChange={(e) => {
                  setRoomName(e.target.value);
                }}
              />

              <input
                type="text"
                name=""
                id=""
                placeholder="Your Name"
                className="w-50 border-2 px-2 focus:border-purple-800 focus:outline-none"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

              <input
                type="submit"
                name=""
                id=""
                onClick={handleSubmit}
                className="h-7 w-30 rounded-xs bg-purple-800 text-xl text-white hover:bg-purple-900 active:bg-purple-600"
              />
            </div>

            <div className="flex h-75 w-80 flex-col gap-2 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
              <p className="text-xl font-semibold text-center">Join Room</p>
              {rooms.length == 0 && <p className="text-center">Create room to list here</p>}
              {rooms.map((room) => {
                return (
                  <div
                    key={room.id}
                    className="flex h-15 w-80 shrink-0 items-center justify-between border-2 px-2 rounded-lg"
                  >
                    {joiningRoomId === room.id ? (
                      <input
                        type="text"
                        value={joinName}
                        placeholder="Enter your name"
                        onChange={(event) => setJoinName(event.target.value)}
                        className="w-50 border-2 px-2 focus:border-purple-800 focus:outline-none"
                      />
                    ) : (
                      <div>
                        <p>Room Name: {room.name}</p>
                        <p>
                          Players: {room.players.length} / {room.maxPlayers} ·{" "}
                          {room.status === "lobby" ? "Lobby open" : "Game locked"}
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => joinRoom(room)}
                      disabled={room.status !== "lobby"}
                      className="h-6 w-20 bg-purple-800 text-center text-white hover:bg-purple-900 active:bg-purple-600"
                    >
                      {room.status === "lobby" ? "Join" : "Locked"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
