import type { Card } from "./types.js";
export declare function createDeck(): Card[];
export declare function shuffleDeck(deck: Card[]): Card[];
export declare class Deck {
    private cards;
    constructor();
    draw(): Card;
    remaining(): number;
}
//# sourceMappingURL=deck.d.ts.map