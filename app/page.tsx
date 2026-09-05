"use client";

import { getPlayerId, savePlayerRoomData } from "@/lib/player";
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

export default function Home() {
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);
  const [joinName, setJoinName] = useState("");

  const router = useRouter()

  useEffect(() => {
    const playerId = getPlayerId();

    socket.emit("register-player", {
      playerId,
    });

    const handleRoomJoined = ({ room }: { room: Room }) => {
      const currentPlayer = room.players.find(
        (player: { playerId: string }) => player.playerId === playerId
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
  }, [router]);

  useEffect(() => {
    const handleRooms = (room: Room[]) => {
      console.log(room);
      
      setRooms(room)
    };
    const playerId = getPlayerId();
    const filteredRoom = rooms.filter(room => room.host === playerId);
    const currentPlayerData = filteredRoom[0]?.players?.filter((player: { playerId: string; }) => playerId === player.playerId)

    socket.on("rooms-updated", handleRooms);

    if(!filteredRoom[0]) {
      return () => socket.off("rooms-updated", handleRooms);
    }
  
    const playerRoomData = {
      hostId: filteredRoom[0].host,
      hostName: currentPlayerData[0].name,
      roomId: filteredRoom[0].id,
      roomName: filteredRoom[0].name,
      players: filteredRoom[0].players
    }
    
    savePlayerRoomData(playerRoomData);

    return () => {
      socket.off("rooms-updated", handleRooms);
    }
  }, [rooms, setRooms])

  function handleSubmit() {
    const data = {
      name: roomName,
      playerId: getPlayerId(),
      playerName: name
    }
    socket.emit("create-room", data);
    setName("");
    setRoomName("");
  }

  function joinRoom(roomId: string) {
    if (joiningRoomId !== roomId) {
      setJoiningRoomId(roomId);
      setJoinName("");
      return;
    }

    if (!joinName.trim()) {
      return;
    }

    socket.emit("join-room", {
      roomId,
      playerId: getPlayerId(),
      playerName: joinName.trim(),
    });
  }

  return (
    <>
      <div className="flex-1 flex justify-center text-black">
        <div className="h-150 w-200 flex flex-col items-center bg-white gap-2.5 py-2">
          <div className="w-60 border-2 flex flex-col justify-center items-center gap-2.5 py-2" >
              <h2>Create Room</h2>
              <input type="text" name="" id="" placeholder="Room Name"
              className="w-50 border-2 px-2"
                      onChange={(e) => {
                        setRoomName(e.target.value)
              }}
              />

              <input type="text" name="" id="" placeholder="Your Name"
              className="w-50 border-2 px-2"
              onChange={(e) => {
                setName(e.target.value)
              }}
              />

              <input type="submit" name="" id="" 
              onClick={handleSubmit}
              className="w-30 h-7 bg-black text-white rounded-xs text-xl hover:h-8 active:bg-purple-600"/>
          </div>

          <div className="flex flex-col">
            {
              rooms.map((room, i) => {
                return (
                  <div key={i} className="border-2 w-80 h-15 px-2 flex justify-between items-center" >
                    
                    {joiningRoomId === room.id ? (
                      <input
                        type="text"
                        value={joinName}
                        placeholder="Enter your name"
                        onChange={(event) => setJoinName(event.target.value)}
                        className="w-32 border-2 px-2"
                      />
                    ) : <div>
                      <p>Room Name: {room.name}</p>
                      <p>Players: {room.players.length} / {room.maxPlayers} · {room.status === "lobby" ? "Lobby open" : "Game locked"}</p>
                    </div>}
                    <button
                      type="button"
                      onClick={() => joinRoom(room.id)}
                      disabled={room.status !== "lobby"}
                      className="w-20 h-6 bg-black text-white text-center hover:h-6.5 active:bg-purple-600"
                    >
                      {room.status === "lobby" ? "Join" : "Locked"}
                    </button>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}
