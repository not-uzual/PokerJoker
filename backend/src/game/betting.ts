import type { PlayerState } from "./types.js";

export function getCallAmount(player: PlayerState, currentBet: number): number {
  return Math.max(0, currentBet - player.currentBet);
}

export function putChips(player: PlayerState, amount: number): number {
  const actualAmount = Math.min(amount, player.chips);
  player.chips -= actualAmount;
  player.currentBet += actualAmount;
  player.totalBet += actualAmount;
  player.acted = true;
  if (player.chips === 0) player.allIn = true;
  return actualAmount;
}

export function postBlind(player: PlayerState, amount: number): number {
  return putChips(player, amount);
}

export function fold(player: PlayerState): void {
  player.folded = true;
  player.acted = true;
}

export function resetBettingRound(player: PlayerState): void {
  player.currentBet = 0;
  player.acted = false;
}

export function resetForNewHand(player: PlayerState): void {
  player.hand = [];
  player.currentBet = 0;
  player.totalBet = 0;
  player.folded = false;
  player.allIn = false;
  player.acted = false;
}
