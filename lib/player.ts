export function getPlayerId() {
  let playerId = localStorage.getItem("playerId");

  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem("playerId", playerId);
  }

  return playerId;
}

export type PlayerRoomData = {
  hostId?: string;
  hostName?: string;
  roomId?: string;
  roomName?: string;
  players?: unknown[];
};

export function savePlayerRoomData(data: PlayerRoomData) {
  localStorage.setItem("player-room-data", JSON.stringify(data));
}

export function getPlayerRoomData() {
  const data = localStorage.getItem("player-room-data") || "{}";
  return JSON.parse(data);
}