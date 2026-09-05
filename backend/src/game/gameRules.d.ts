import type { GamePhase, PlayerAction, PlayerState } from "./types.js";
export declare function assertCanStart(players: PlayerState[], phase: GamePhase): void;
export declare function assertCanAddPlayer(phase: GamePhase, players: PlayerState[], playerId: string): void;
export declare function assertCanAct(phase: GamePhase, player: PlayerState, currentPlayerId: string | undefined, playerId: string): void;
export declare function assertActionAllowed(player: PlayerState, action: PlayerAction, currentBet: number, minRaise: number, bigBlind: number): void;
export declare function isBettingRoundComplete(players: PlayerState[], currentBet: number): boolean;
export declare function getNextPlayerIndex(players: PlayerState[], currentIndex: number): number | undefined;
export declare function getSmallBlindIndex(dealerIndex: number, playerCount: number): number;
export declare function getBigBlindIndex(dealerIndex: number, playerCount: number): number;
//# sourceMappingURL=gameRules.d.ts.map