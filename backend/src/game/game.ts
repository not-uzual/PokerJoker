import { Deck } from "./deck.js";
import { postBlind, resetForNewHand } from "./betting.js";
import { GameEngine } from "./gameEngine.js";
import { assertCanAddPlayer, assertCanStart, getBigBlindIndex, getSmallBlindIndex } from "./gameRules.js";
import { createPlayer } from "./player.js";
import type { GameSnapshot, GameState, PlayerAction, PlayerState } from "./types.js";

export class Game {
  readonly id: string;
  private readonly engine = new GameEngine();
  private readonly state: GameState;

  constructor(id: string, players: PlayerState[] = [], smallBlind = 10, bigBlind = 20) {
    this.id = id;
    this.state = {
      deck: new Deck(), players, communityCards: [], pot: 0, currentBet: 0,
      minRaise: bigBlind, dealerIndex: 0, currentPlayerIndex: 0,
      smallBlind, bigBlind, showdownResults: [], phase: "waiting", turnEndsAt: null,
    };
  }

  addPlayer(id: string, name: string, chips: number): void {
    assertCanAddPlayer(this.state.phase, this.state.players, id);
    this.state.players.push(createPlayer(id, name, chips));
  }

  removePlayer(id: string): void {
    if (this.state.phase !== "waiting") throw new Error("Cannot remove players during a hand");
    this.state.players = this.state.players.filter(player => player.id !== id);
  }

  beginStarting(): void {
    assertCanStart(this.state.players, this.state.phase);
    this.state.phase = "starting";
  }

  dealForPreview(): void {
    if (this.state.phase !== "starting") throw new Error("Game has not been scheduled to start");
    this.state.deck = new Deck();
    this.state.communityCards = [];
    this.state.pot = 0;
    this.state.currentBet = 0;
    this.state.minRaise = this.state.bigBlind;
    this.state.showdownResults = [];
    this.state.phase = "preview";
    for (const player of this.state.players) resetForNewHand(player);
    for (let card = 0; card < 2; card++) {
      for (const player of this.state.players) player.hand.push(this.state.deck.draw());
    }
    this.postBlinds();
    // Posting a forced blind is not a voluntary betting action. In
    // particular, the big blind must still get the option to check or raise.
    for (const player of this.state.players) player.acted = false;
    const bigBlindIndex = getBigBlindIndex(this.state.dealerIndex, this.state.players.length);
    this.state.currentPlayerIndex = this.state.players.length === 2 ? this.state.dealerIndex : (bigBlindIndex + 1) % this.state.players.length;
  }

  beginBetting(): void {
    if (this.state.phase !== "preview") throw new Error("Cards have not been dealt yet");
    this.state.phase = "preflop";
  }

  setTurnEndsAt(turnEndsAt: number | null): void {
    this.state.turnEndsAt = turnEndsAt;
  }

  handleAction(playerId: string, action: PlayerAction): void {
    this.engine.handleAction(this.state, playerId, action);
  }

  getState(): GameSnapshot {
    return this.createSnapshot(this.state.players);
  }

  getPublicState(viewerId: string): GameSnapshot {
    return this.createSnapshot(this.state.players.map(player => ({
        ...player,
        hand: player.id === viewerId || this.state.phase === "finished" ? [...player.hand] : [],
      })));
  }

  private createSnapshot(players: PlayerState[]): GameSnapshot {
    return {
      players: players.map(player => ({ ...player, hand: [...player.hand] })),
      communityCards: [...this.state.communityCards],
      pot: this.state.pot,
      currentBet: this.state.currentBet,
      minRaise: this.state.minRaise,
      dealerIndex: this.state.dealerIndex,
      currentPlayerIndex: this.state.currentPlayerIndex,
      smallBlind: this.state.smallBlind,
      bigBlind: this.state.bigBlind,
      showdownResults: [...this.state.showdownResults],
      phase: this.state.phase,
      turnEndsAt: this.state.turnEndsAt,
    };
  }

  private postBlinds(): void {
    const smallBlindIndex = getSmallBlindIndex(this.state.dealerIndex, this.state.players.length);
    const bigBlindIndex = getBigBlindIndex(this.state.dealerIndex, this.state.players.length);
    const smallBlind = this.state.players[smallBlindIndex];
    const bigBlind = this.state.players[bigBlindIndex];
    if (!smallBlind || !bigBlind) throw new Error("Unable to find blind players");
    this.state.pot += postBlind(smallBlind, this.state.smallBlind);
    this.state.pot += postBlind(bigBlind, this.state.bigBlind);
    this.state.currentBet = bigBlind.currentBet;
  }
}
