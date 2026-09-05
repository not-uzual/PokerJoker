export type Suit = "H" | "D" | "C" | "S";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14";
export type Card = {
    suit: Suit;
    rank: Rank;
};
export type PlayerState = {
    id: string;
    name: string;
    chips: number;
    hand: Card[];
    currentBet: number;
    totalBet: number;
    folded: boolean;
    allIn: boolean;
    acted: boolean;
};
export type PlayerAction = {
    type: "fold";
} | {
    type: "check";
} | {
    type: "call";
} | {
    type: "bet";
    amount: number;
} | {
    type: "raise";
    amount: number;
} | {
    type: "all-in";
};
export type GamePhase = "waiting" | "starting" | "preview" | "preflop" | "flop" | "turn" | "river" | "showdown" | "finished";
export type HandRank = "high-card" | "pair" | "two-pair" | "three-of-a-kind" | "straight" | "flush" | "full-house" | "four-of-a-kind" | "straight-flush" | "royal-flush";
export type EvaluatedHand = {
    rank: HandRank;
    /**
     * Used to compare two hands.
     * Higher is better.
     */
    score: number[];
    cards: Card[];
};
export type ShowdownResult = {
    playerId: string;
    hand: EvaluatedHand | null;
    amountWon: number;
};
export type Pot = {
    amount: number;
    eligiblePlayerIds: string[];
};
import type { Deck } from "./deck.js";
export type GameState = {
    deck: Deck;
    players: PlayerState[];
    communityCards: Card[];
    pot: number;
    currentBet: number;
    minRaise: number;
    dealerIndex: number;
    currentPlayerIndex: number;
    smallBlind: number;
    bigBlind: number;
    showdownResults: ShowdownResult[];
    phase: GamePhase;
    turnEndsAt: number | null;
};
export type GameSnapshot = Omit<GameState, "deck">;
//# sourceMappingURL=types.d.ts.map