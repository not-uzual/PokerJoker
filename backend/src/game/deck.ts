import type { Card, Rank, Suit } from "./types.js";

const suits: Suit[] = [
  "H",
  "D",
  "C",
  "S",
];

const ranks: Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
      });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j]!,
      shuffled[i]!,
    ];
  }
  return shuffled;
}

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = shuffleDeck(createDeck());
  }

  draw(): Card {
    const card = this.cards.pop();

    if (!card) {
      throw new Error("Deck is empty");
    }

    return card;
  }

  remaining(): number {
    return this.cards.length;
  }
}