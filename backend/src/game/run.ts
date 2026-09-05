import type { Card, PlayerState } from "./types.js";

export function giveCard(
  player: PlayerState,
  card: Card
): void {
  player.hand.push(card);
}

export function resetPlayerForNewHand(
  player: PlayerState
): void {
  player.hand = [];

  player.currentBet = 0;
  player.totalBet = 0;

  player.folded = false;
  player.allIn = false;
}