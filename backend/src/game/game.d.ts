import type { GameSnapshot, PlayerAction, PlayerState } from "./types.js";
export declare class Game {
    readonly id: string;
    private readonly engine;
    private readonly state;
    constructor(id: string, players?: PlayerState[], smallBlind?: number, bigBlind?: number);
    addPlayer(id: string, name: string, chips: number): void;
    removePlayer(id: string): void;
    beginStarting(): void;
    dealForPreview(): void;
    beginBetting(): void;
    setTurnEndsAt(turnEndsAt: number | null): void;
    handleAction(playerId: string, action: PlayerAction): void;
    getState(): GameSnapshot;
    getPublicState(viewerId: string): GameSnapshot;
    private createSnapshot;
    private postBlinds;
}
//# sourceMappingURL=game.d.ts.map