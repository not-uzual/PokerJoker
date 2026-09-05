import type { PlayerState } from "./types.js";
export declare function getCallAmount(player: PlayerState, currentBet: number): number;
export declare function putChips(player: PlayerState, amount: number): number;
export declare function postBlind(player: PlayerState, amount: number): number;
export declare function fold(player: PlayerState): void;
export declare function resetBettingRound(player: PlayerState): void;
export declare function resetForNewHand(player: PlayerState): void;
//# sourceMappingURL=betting.d.ts.map