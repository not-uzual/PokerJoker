import type { GameState, PlayerAction } from "./types.js";
export declare class GameEngine {
    handleAction(state: GameState, playerId: string, action: PlayerAction): void;
    private advance;
    private endBettingRound;
    private showdown;
    private getWinners;
    private getFirstPostFlopPlayer;
    private resetOtherPlayers;
    private runOutIfNoOneCanAct;
    private collectChips;
    private getPlayer;
}
//# sourceMappingURL=gameEngine.d.ts.map