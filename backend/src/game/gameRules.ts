import type { GamePhase, PlayerAction, PlayerState } from "./types.js";

export function assertCanStart(players: PlayerState[], phase: GamePhase): void {
  if (phase !== "waiting" && phase !== "finished") throw new Error("A hand has already started");
  if (players.length < 2) throw new Error("At least 2 players are required");
}

export function assertCanAddPlayer(phase: GamePhase, players: PlayerState[], playerId: string): void {
  if (phase !== "waiting") throw new Error("Cannot join a game that has already started");
  if (players.some(player => player.id === playerId)) throw new Error("Player already exists");
}

export function assertCanAct(phase: GamePhase, player: PlayerState, currentPlayerId: string | undefined, playerId: string): void {
  if (phase === "waiting" || phase === "starting" || phase === "preview" || phase === "showdown" || phase === "finished") throw new Error("No actions are allowed in this phase");
  if (player.folded || player.allIn) throw new Error("Player cannot act");
  if (currentPlayerId !== playerId) throw new Error("Not this player's turn");
}

export function assertActionAllowed(player: PlayerState, action: PlayerAction, currentBet: number, minRaise: number, bigBlind: number): void {
  switch (action.type) {
    case "check":
      if (player.currentBet !== currentBet) throw new Error("Cannot check when facing a bet");
      return;
    case "call":
      if (currentBet <= player.currentBet) throw new Error("Nothing to call");
      return;
    case "bet":
      if (currentBet !== 0) throw new Error("Cannot bet when a bet already exists");
      if (action.amount < bigBlind) throw new Error(`Minimum bet is ${bigBlind}`);
      if (action.amount > player.chips) throw new Error("Bet exceeds player's chips");
      return;
    case "raise": {
      if (currentBet === 0 || action.amount <= currentBet) throw new Error("Raise must exceed current bet");
      const isAllIn = action.amount === player.currentBet + player.chips;
      if (action.amount - currentBet < minRaise && !isAllIn) throw new Error(`Minimum raise is ${minRaise}`);
      if (action.amount - player.currentBet > player.chips) throw new Error("Raise exceeds player's chips");
      return;
    }
    case "all-in":
      if (player.chips <= 0) throw new Error("Player has no chips");
      return;
    case "fold":
      return;
  }
}

export function isBettingRoundComplete(players: PlayerState[], currentBet: number): boolean {
  const playersWhoCanAct = players.filter(player => !player.folded && !player.allIn);
  // A single player who can still act may be facing an all-in bet, so they
  // must be allowed to call or fold before the street can end.
  return playersWhoCanAct.every(player => player.acted && player.currentBet === currentBet);
}

export function getNextPlayerIndex(players: PlayerState[], currentIndex: number): number | undefined {
  for (let offset = 1; offset <= players.length; offset++) {
    const index = (currentIndex + offset) % players.length;
    const player = players[index];
    if (player && !player.folded && !player.allIn) return index;
  }
  return undefined;
}

export function getSmallBlindIndex(dealerIndex: number, playerCount: number): number {
  return playerCount === 2 ? dealerIndex : (dealerIndex + 1) % playerCount;
}

export function getBigBlindIndex(dealerIndex: number, playerCount: number): number {
  return playerCount === 2 ? (dealerIndex + 1) % playerCount : (dealerIndex + 2) % playerCount;
}
