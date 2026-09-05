export function createPlayer(id, name, chips) {
    return { id, name, chips, hand: [], currentBet: 0, totalBet: 0, folded: false, allIn: false, acted: false };
}
export class Player {
    id;
    name;
    chips;
    hand;
    currentBet;
    totalBet;
    folded;
    allIn;
    acted;
    constructor(id, name, chips) {
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
    fold() {
        if (this.folded) {
            throw new Error("Player has already folded");
        }
        if (this.allIn) {
            throw new Error("All-in player cannot fold");
        }
        this.folded = true;
        this.acted = true;
    }
    bet(amount) {
        return this.putChips(amount);
    }
    call(amount) {
        return this.putChips(amount);
    }
    allInBet() {
        if (this.allIn) {
            throw new Error("Player is already all-in");
        }
        return this.putChips(this.chips);
    }
    // ----------------
    // Cards
    // ----------------
    addCard(card) {
        this.hand.push(card);
    }
    clearHand() {
        this.hand = [];
    }
    // ----------------
    // Betting
    // ----------------
    resetBettingRound() {
        this.currentBet = 0;
        this.acted = false;
    }
    resetForNewHand() {
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
    putChips(amount) {
        if (amount <= 0) {
            throw new Error("Bet amount must be greater than zero");
        }
        if (this.allIn) {
            throw new Error("Player is already all-in");
        }
        const actualAmount = Math.min(amount, this.chips);
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
    getState() {
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
//# sourceMappingURL=player.js.map