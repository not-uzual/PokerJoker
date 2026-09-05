export function getCallAmount(player, currentBet) {
    return Math.max(0, currentBet - player.currentBet);
}
export function putChips(player, amount) {
    const actualAmount = Math.min(amount, player.chips);
    player.chips -= actualAmount;
    player.currentBet += actualAmount;
    player.totalBet += actualAmount;
    player.acted = true;
    if (player.chips === 0)
        player.allIn = true;
    return actualAmount;
}
export function postBlind(player, amount) {
    return putChips(player, amount);
}
export function fold(player) {
    player.folded = true;
    player.acted = true;
}
export function resetBettingRound(player) {
    player.currentBet = 0;
    player.acted = false;
}
export function resetForNewHand(player) {
    player.hand = [];
    player.currentBet = 0;
    player.totalBet = 0;
    player.folded = false;
    player.allIn = false;
    player.acted = false;
}
//# sourceMappingURL=betting.js.map