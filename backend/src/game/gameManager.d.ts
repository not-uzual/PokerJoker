import { Game } from "./game.js";
import type { PlayerState } from "./types.js";
export declare class GameManager {
    private games;
    private playerSockets;
    createGame(gameId: string, players?: PlayerState[], smallBlind?: number, bigBlind?: number): Game;
    getGame(gameId: string): Game;
    startGame(gameId: string): Game;
    setPlayerSocket(playerId: string, socketId: string): void;
    getPlayerSocket(playerId: string): string | undefined;
    getPlayerIds(): string[];
    removePlayerSocket(playerId: string): void;
    removeSocket(socketId: string): void;
    hasGame(gameId: string): boolean;
}
//# sourceMappingURL=gameManager.d.ts.map