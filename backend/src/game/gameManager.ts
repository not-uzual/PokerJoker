import { Game } from "./game.js";
import type { PlayerState } from "./types.js";

export class GameManager {
  private games =
    new Map<string, Game>();

  private playerSockets =
    new Map<string, string>();

  createGame(gameId: string, players: PlayerState[] = [], smallBlind = 10, bigBlind = 20): Game {
    const game = new Game(gameId, players, smallBlind, bigBlind);

    this.games.set(
      gameId,
      game
    );

    return game;
  }

  getGame(gameId: string): Game {
    const game =
      this.games.get(gameId);

    if (!game) {
      throw new Error(
        "Game not found"
      );
    }

    return game;
  }

  startGame(gameId: string): Game {
    const game = this.getGame(gameId);
    game.beginStarting();
    return game;
  }

  setPlayerSocket(
    playerId: string,
    socketId: string
  ): void {
    this.playerSockets.set(
      playerId,
      socketId
    );
  }

  getPlayerSocket(
    playerId: string
  ): string | undefined {
    return this.playerSockets.get(
      playerId
    );
  }

  getPlayerIds(): string[] {
    return [...this.playerSockets.keys()];
  }

  removePlayerSocket(
    playerId: string
  ): void {
    this.playerSockets.delete(
      playerId
    );
  }

  removeSocket(socketId: string): void {
    for (const [playerId, connectedSocketId] of this.playerSockets) {
      if (connectedSocketId === socketId) {
        this.playerSockets.delete(playerId);
      }
    }
  }

  hasGame(gameId: string): boolean {
    return this.games.has(gameId);
  }
}
