import { Game } from "./game.js";
export class GameManager {
    games = new Map();
    playerSockets = new Map();
    createGame(gameId, players = [], smallBlind = 10, bigBlind = 20) {
        const game = new Game(gameId, players, smallBlind, bigBlind);
        this.games.set(gameId, game);
        return game;
    }
    getGame(gameId) {
        const game = this.games.get(gameId);
        if (!game) {
            throw new Error("Game not found");
        }
        return game;
    }
    startGame(gameId) {
        const game = this.getGame(gameId);
        game.beginStarting();
        return game;
    }
    setPlayerSocket(playerId, socketId) {
        this.playerSockets.set(playerId, socketId);
    }
    getPlayerSocket(playerId) {
        return this.playerSockets.get(playerId);
    }
    getPlayerIds() {
        return [...this.playerSockets.keys()];
    }
    removePlayerSocket(playerId) {
        this.playerSockets.delete(playerId);
    }
    removeSocket(socketId) {
        for (const [playerId, connectedSocketId] of this.playerSockets) {
            if (connectedSocketId === socketId) {
                this.playerSockets.delete(playerId);
            }
        }
    }
    hasGame(gameId) {
        return this.games.has(gameId);
    }
}
//# sourceMappingURL=gameManager.js.map