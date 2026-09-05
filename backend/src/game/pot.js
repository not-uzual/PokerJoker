export function buildPots(players) {
    const levels = [
        ...new Set(players
            .map(player => player.totalBet)
            .filter(amount => amount > 0)),
    ].sort((a, b) => a - b);
    const pots = [];
    let previousLevel = 0;
    for (const level of levels) {
        const contribution = level - previousLevel;
        if (contribution <= 0) {
            continue;
        }
        const contributors = players.filter(player => player.totalBet >= level);
        const amount = contribution * contributors.length;
        if (amount > 0) {
            const eligiblePlayerIds = contributors
                .filter(player => !player.folded)
                .map(player => player.id);
            pots.push({
                amount,
                eligiblePlayerIds,
            });
        }
        previousLevel = level;
    }
    return pots;
}
//# sourceMappingURL=pot.js.map