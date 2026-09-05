import type { Card, PlayerState } from "./types.js";
export declare function createPlayer(id: string, name: string, chips: number): PlayerState;
export declare class Player {
    readonly id: string;
    readonly name: string;
    private chips;
    private hand;
    private currentBet;
    private totalBet;
    private folded;
    private allIn;
    private acted;
    constructor(id: string, name: string, chips: number);
    fold(): void;
    bet(amount: number): number;
    call(amount: number): number;
    allInBet(): number;
    addCard(card: Card): void;
    clearHand(): void;
    resetBettingRound(): void;
    resetForNewHand(): void;
    private putChips;
    getState(): PlayerState;
}
//# sourceMappingURL=player.d.ts.map