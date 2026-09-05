import type { Server, Socket } from "socket.io";
import { GameManager } from "../game/gameManager.js";
import type { PlayerAction } from "../game/types.js";
import { CARD_PREVIEW_DURATION_MS, JOKER_DEAL_COUNTDOWN_MS, PLAYER_ACTION_DURATION_MS } from "../game/config.js";

type RoomPlayer = { playerId: string; name: string; socketId: string | undefined };
type Room = { id: string; name: string; host: string; players: RoomPlayer[]; maxPlayers: number; status: "lobby" | "starting" | "in-progress" | "finished" };
type GameTimers = Map<string, ReturnType<typeof setTimeout>>;

export function registerSocketHandlers(io: Server): void {
  const games = new GameManager();
  const rooms = new Map<string, Room>();
  const timers: GameTimers = new Map();

  io.on("connection", socket => {
    socket.emit("rooms-updated", [...rooms.values()]);

    socket.on("register-player", ({ playerId }: { playerId: string }) => {
      if (!playerId) return;
      games.setPlayerSocket(playerId, socket.id);
      for (const room of rooms.values()) {
        const player = room.players.find(candidate => candidate.playerId === playerId);
        if (!player) continue;
        player.socketId = socket.id;
        socket.join(room.id);
        emitGameState(io, room.id, games, rooms);
      }
      io.emit("rooms-updated", [...rooms.values()]);
    });

    registerRoomEvents(io, socket, games, rooms);
    registerGameEvents(io, socket, games, rooms, timers);

    socket.on("disconnect", () => {
      games.removeSocket(socket.id);
      for (const room of rooms.values()) {
        const player = room.players.find(candidate => candidate.socketId === socket.id);
        if (player) player.socketId = undefined;
      }
      io.emit("rooms-updated", [...rooms.values()]);
    });
  });
}

function registerRoomEvents(io: Server, socket: Socket, games: GameManager, rooms: Map<string, Room>): void {
  socket.on("create-room", ({ name, playerId, playerName }: { name: string; playerId: string; playerName: string }) => {
    const roomName = name?.trim();
    const displayName = playerName?.trim();
    if (!roomName || !displayName || !playerId) return socket.emit("room-error", { message: "Room name and player name are required" });
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room: Room = { id: roomId, name: roomName, host: playerId, players: [{ playerId, name: displayName, socketId: socket.id }], maxPlayers: 9, status: "lobby" };
    rooms.set(roomId, room);
    games.createGame(roomId).addPlayer(playerId, displayName, 1000);
    games.setPlayerSocket(playerId, socket.id);
    socket.join(roomId);
    io.emit("rooms-updated", [...rooms.values()]);
    socket.emit("room-joined", { room });
    emitGameState(io, roomId, games, rooms);
  });

  socket.on("join-room", ({ roomId, playerId, playerName }: { roomId: string; playerId: string; playerName: string }) => {
    const room = rooms.get(roomId);
    const displayName = playerName?.trim();
    if (!room) return socket.emit("room-error", { message: "Room not found" });
    if (room.status !== "lobby") return socket.emit("room-error", { message: "This hand has already started. Join a new lobby for the next game." });
    const existingPlayer = room.players.find(player => player.playerId === playerId);
    if (existingPlayer) {
      existingPlayer.socketId = socket.id;
      games.setPlayerSocket(playerId, socket.id);
      socket.join(roomId);
      socket.emit("room-joined", { room });
      emitGameState(io, roomId, games, rooms);
      return;
    }
    if (!displayName || !playerId) return socket.emit("room-error", { message: "Player name is required" });
    if (room.players.length >= room.maxPlayers) return socket.emit("room-error", { message: "Room is full" });
    try {
      games.getGame(roomId).addPlayer(playerId, displayName, 1000);
      room.players.push({ playerId, name: displayName, socketId: socket.id });
      games.setPlayerSocket(playerId, socket.id);
      socket.join(roomId);
      io.emit("rooms-updated", [...rooms.values()]);
      socket.emit("room-joined", { room });
      emitGameState(io, roomId, games, rooms);
    } catch (error) {
      socket.emit("room-error", { message: error instanceof Error ? error.message : "Unable to join room" });
    }
  });
}

function registerGameEvents(io: Server, socket: Socket, games: GameManager, rooms: Map<string, Room>, timers: GameTimers): void {
  socket.on("start-game", ({ roomId, playerId }: { roomId: string; playerId: string }) => {
    const room = rooms.get(roomId);
    if (!room || room.host !== playerId || games.getPlayerSocket(playerId) !== socket.id || (room.status !== "lobby" && room.status !== "finished")) {
      return socket.emit("game-error", { message: "Only the connected host can start the game" });
    }
    try {
      games.startGame(roomId);
      room.status = "starting";
      io.emit("rooms-updated", [...rooms.values()]);
      startCountdown(io, roomId, games, rooms, timers);
      emitGameState(io, roomId, games, rooms);
    } catch (error) {
      socket.emit("game-error", { message: error instanceof Error ? error.message : "Unable to start game" });
    }
  });

  socket.on("game-action", ({ roomId, playerId, action }: { roomId: string; playerId: string; action: PlayerAction }) => {
    const room = rooms.get(roomId);
    if (!room || games.getPlayerSocket(playerId) !== socket.id || !socket.rooms.has(roomId)) {
      return socket.emit("game-error", { message: "You are not connected to this game" });
    }
    try {
      games.getGame(roomId).handleAction(playerId, action);
      scheduleTurn(io, roomId, games, rooms, timers);
      emitGameState(io, roomId, games, rooms);
    } catch (error) {
      socket.emit("game-error", { message: error instanceof Error ? error.message : "Unable to perform action" });
    }
  });
}

function clearGameTimer(roomId: string, timers: GameTimers): void {
  const timer = timers.get(roomId);
  if (timer) clearTimeout(timer);
  timers.delete(roomId);
}

function startCountdown(io: Server, roomId: string, games: GameManager, rooms: Map<string, Room>, timers: GameTimers): void {
  const game = games.getGame(roomId);
  game.setTurnEndsAt(Date.now() + JOKER_DEAL_COUNTDOWN_MS);
  clearGameTimer(roomId, timers);
  timers.set(roomId, setTimeout(() => {
    game.dealForPreview();
    game.setTurnEndsAt(Date.now() + CARD_PREVIEW_DURATION_MS);
    emitGameState(io, roomId, games, rooms);
    timers.set(roomId, setTimeout(() => {
      game.beginBetting();
      const room = rooms.get(roomId);
      if (room) room.status = "in-progress";
      io.emit("rooms-updated", [...rooms.values()]);
      scheduleTurn(io, roomId, games, rooms, timers);
      emitGameState(io, roomId, games, rooms);
    }, CARD_PREVIEW_DURATION_MS));
  }, JOKER_DEAL_COUNTDOWN_MS));
}

function scheduleTurn(io: Server, roomId: string, games: GameManager, rooms: Map<string, Room>, timers: GameTimers): void {
  const game = games.getGame(roomId);
  const state = game.getState();
  if (!["preflop", "flop", "turn", "river"].includes(state.phase)) {
    game.setTurnEndsAt(null);
    if (state.phase === "finished") {
      const room = rooms.get(roomId);
      if (room) room.status = "finished";
      io.emit("rooms-updated", [...rooms.values()]);
    }
    return;
  }
  const player = state.players[state.currentPlayerIndex];
  if (!player) return;
  game.setTurnEndsAt(Date.now() + PLAYER_ACTION_DURATION_MS);
  clearGameTimer(roomId, timers);
  timers.set(roomId, setTimeout(() => {
    const latest = game.getState();
    const current = latest.players[latest.currentPlayerIndex];
    if (!current || !["preflop", "flop", "turn", "river"].includes(latest.phase)) return;
    // Timeout defaults to check when free, otherwise fold; it never spends a
    // player's chips without their explicit decision.
    game.handleAction(current.id, current.currentBet === latest.currentBet ? { type: "check" } : { type: "fold" });
    scheduleTurn(io, roomId, games, rooms, timers);
    emitGameState(io, roomId, games, rooms);
  }, PLAYER_ACTION_DURATION_MS));
}

function emitGameState(io: Server, roomId: string, games: GameManager, rooms: Map<string, Room>): void {
  const room = rooms.get(roomId);
  if (!room) return;
  const game = games.getGame(roomId);
  for (const player of room.players) {
    if (player.socketId) io.to(player.socketId).emit("game-state", game.getPublicState(player.playerId));
  }
}
