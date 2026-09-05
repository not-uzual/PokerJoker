import { fold, getCallAmount, putChips, resetBettingRound } from "./betting.js";
import { compareHands, evaluateHand } from "./evaluater.js";
import { assertActionAllowed, assertCanAct, getNextPlayerIndex, isBettingRoundComplete } from "./gameRules.js";
import { buildPots } from "./pot.js";
import type { GameState, PlayerAction, PlayerState, ShowdownResult } from "./types.js";

export class GameEngine {
  handleAction(state: GameState, playerId: string, action: PlayerAction): void {
    const player = this.getPlayer(state.players, playerId);
    assertCanAct(state.phase, player, state.players[state.currentPlayerIndex]?.id, playerId);
    assertActionAllowed(player, action, state.currentBet, state.minRaise, state.bigBlind);

    switch (action.type) {
      case "fold": fold(player); break;
      case "check": player.acted = true; break;
      case "call": this.collectChips(state, player, getCallAmount(player, state.currentBet)); break;
      case "bet":
        this.collectChips(state, player, action.amount);
        state.currentBet = player.currentBet;
        state.minRaise = action.amount;
        this.resetOtherPlayers(state, player);
        break;
      case "raise": {
        const previousBet = state.currentBet;
        this.collectChips(state, player, action.amount - player.currentBet);
        state.currentBet = Math.max(state.currentBet, player.currentBet);
        state.minRaise = state.currentBet - previousBet >= state.minRaise ? state.currentBet - previousBet : state.minRaise;
        this.resetOtherPlayers(state, player);
        break;
      }
      case "all-in": {
        const previousBet = state.currentBet;
        this.collectChips(state, player, player.chips);
        const raiseSize = player.currentBet - previousBet;
        if (player.currentBet > previousBet && raiseSize >= state.minRaise) {
          state.currentBet = player.currentBet;
          state.minRaise = raiseSize;
          this.resetOtherPlayers(state, player);
        }
        break;
      }
    }
    this.advance(state);
  }

  private advance(state: GameState): void {
    const activePlayers = state.players.filter(player => !player.folded);
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      if (winner) {
        winner.chips += state.pot;
        state.showdownResults = [{ playerId: winner.id, hand: null, amountWon: state.pot }];
      }
      state.pot = 0;
      state.phase = "finished";
      state.dealerIndex = (state.dealerIndex + 1) % state.players.length;
      return;
    }
    if (!isBettingRoundComplete(state.players, state.currentBet)) {
      const next = getNextPlayerIndex(state.players, state.currentPlayerIndex);
      if (next !== undefined) state.currentPlayerIndex = next;
      return;
    }
    this.endBettingRound(state);
  }

  private endBettingRound(state: GameState): void {
    if (state.phase === "river") {
      this.showdown(state);
      return;
    }
    state.phase = state.phase === "preflop" ? "flop" : state.phase === "flop" ? "turn" : "river";
    state.deck.draw();
    const cardsToDeal = state.phase === "flop" ? 3 : 1;
    for (let i = 0; i < cardsToDeal; i++) state.communityCards.push(state.deck.draw());
    for (const player of state.players) resetBettingRound(player);
    state.currentBet = 0;
    state.minRaise = state.bigBlind;
    state.currentPlayerIndex = this.getFirstPostFlopPlayer(state);
    this.runOutIfNoOneCanAct(state);
  }

  private showdown(state: GameState): void {
    state.phase = "showdown";
    state.showdownResults = [];
    for (const pot of buildPots(state.players)) {
      const results = state.players.filter(player => pot.eligiblePlayerIds.includes(player.id)).map(player => ({
        playerId: player.id,
        hand: evaluateHand([...player.hand, ...state.communityCards]),
        amountWon: 0,
      }));
      if (results.length === 0) continue;
      const winners = this.getWinners(results);
      const share = Math.floor(pot.amount / winners.length);
      const remainder = pot.amount - share * winners.length;
      for (const [index, winner] of winners.entries()) {
        const amountWon = share + (index === 0 ? remainder : 0);
        this.getPlayer(state.players, winner.playerId).chips += amountWon;
        const existing = state.showdownResults.find(result => result.playerId === winner.playerId);
        if (existing) existing.amountWon += amountWon;
        else state.showdownResults.push({ ...winner, amountWon });
      }
    }
    state.phase = "finished";
    state.pot = 0;
    state.dealerIndex = (state.dealerIndex + 1) % state.players.length;
  }

  private getWinners(results: Array<ShowdownResult & { hand: NonNullable<ShowdownResult["hand"]> }>): Array<ShowdownResult & { hand: NonNullable<ShowdownResult["hand"]> }> {
    const best = results.reduce((current, result) => compareHands(result.hand, current.hand) > 0 ? result : current);
    return results.filter(result => compareHands(result.hand, best.hand) === 0);
  }

  private getFirstPostFlopPlayer(state: GameState): number {
    for (let offset = 1; offset <= state.players.length; offset++) {
      const index = (state.dealerIndex + offset) % state.players.length;
      const player = state.players[index];
      if (player && !player.folded && !player.allIn) return index;
    }
    return state.dealerIndex;
  }

  private resetOtherPlayers(state: GameState, actingPlayer: PlayerState): void {
    for (const player of state.players) {
      if (player.id !== actingPlayer.id && !player.folded && !player.allIn) player.acted = false;
    }
  }

  private runOutIfNoOneCanAct(state: GameState): void {
    if (state.players.some(player => !player.folded && !player.allIn)) return;

    while (state.phase !== "river") {
      state.phase = state.phase === "preflop" ? "flop" : state.phase === "flop" ? "turn" : "river";
      state.deck.draw();
      const cardsToDeal = state.phase === "flop" ? 3 : 1;
      for (let i = 0; i < cardsToDeal; i++) state.communityCards.push(state.deck.draw());
    }
    this.showdown(state);
  }

  private collectChips(state: GameState, player: PlayerState, amount: number): void {
    state.pot += putChips(player, amount);
  }

  private getPlayer(players: PlayerState[], playerId: string): PlayerState {
    const player = players.find(candidate => candidate.id === playerId);
    if (!player) throw new Error("Player not found");
    return player;
  }
}
