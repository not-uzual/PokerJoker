import type { Card, PlayerState } from "./types.js";

export function createPlayer(id: string, name: string, chips: number): PlayerState {
  return { id, name, chips, hand: [], currentBet: 0, totalBet: 0, folded: false, allIn: false, acted: false };
}

export class Player {
  public readonly id: string;
  public readonly name: string;

  private chips: number;
  private hand: Card[];

  private currentBet: number;
  private totalBet: number;

  private folded: boolean;
  private allIn: boolean;
  private acted: boolean;

  constructor(
    id: string,
    name: string,
    chips: number
  ) {
    this.id = id;
    this.name = name;

    this.chips = chips;
    this.hand = [];

    this.currentBet = 0;
    this.totalBet = 0;

    this.folded = false;
    this.allIn = false;
    this.acted = false;
  }

  // ----------------
  // Actions
  // ----------------

  fold(): void {
    if (this.folded) {
      throw new Error("Player has already folded");
    }

    if (this.allIn) {
      throw new Error("All-in player cannot fold");
    }

    this.folded = true;
    this.acted = true;
  }

  bet(amount: number): number {
    return this.putChips(amount);
  }

  call(amount: number): number {
    return this.putChips(amount);
  }

  allInBet(): number {
    if (this.allIn) {
      throw new Error("Player is already all-in");
    }

    return this.putChips(this.chips);
  }

  // ----------------
  // Cards
  // ----------------

  addCard(card: Card): void {
    this.hand.push(card);
  }

  clearHand(): void {
    this.hand = [];
  }

  // ----------------
  // Betting
  // ----------------

  resetBettingRound(): void {
    this.currentBet = 0;
    this.acted = false;
  }

  resetForNewHand(): void {
    this.hand = [];

    this.currentBet = 0;
    this.totalBet = 0;

    this.folded = false;
    this.allIn = false;
    this.acted = false;
  }

  // ----------------
  // Internal
  // ----------------

  private putChips(amount: number): number {
    if (amount <= 0) {
      throw new Error(
        "Bet amount must be greater than zero"
      );
    }

    if (this.allIn) {
      throw new Error(
        "Player is already all-in"
      );
    }

    const actualAmount = Math.min(
      amount,
      this.chips
    );

    this.chips -= actualAmount;

    this.currentBet += actualAmount;
    this.totalBet += actualAmount;

    this.acted = true;

    if (this.chips === 0) {
      this.allIn = true;
    }

    return actualAmount;
  }

  // ----------------
  // State
  // ----------------

  getState(): PlayerState {
    return {
      id: this.id,
      name: this.name,
      chips: this.chips,

      hand: [...this.hand],

      currentBet: this.currentBet,
      totalBet: this.totalBet,

      folded: this.folded,
      allIn: this.allIn,
      acted: this.acted,
    };
  }
}