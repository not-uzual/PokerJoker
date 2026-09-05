const suits = [
    "H",
    "D",
    "C",
    "S",
];
const ranks = [
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
export function createDeck() {
    const deck = [];
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
export function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i],
        ];
    }
    return shuffled;
}
export class Deck {
    cards;
    constructor() {
        this.cards = shuffleDeck(createDeck());
    }
    draw() {
        const card = this.cards.pop();
        if (!card) {
            throw new Error("Deck is empty");
        }
        return card;
    }
    remaining() {
        return this.cards.length;
    }
}
//# sourceMappingURL=deck.js.map