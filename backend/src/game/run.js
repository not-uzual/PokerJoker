export function giveCard(player, card) {
    player.hand.push(card);
}
export function resetPlayerForNewHand(player) {
    player.hand = [];
    player.currentBet = 0;
    player.totalBet = 0;
    player.folded = false;
    player.allIn = false;
}
//# sourceMappingURL=run.js.map