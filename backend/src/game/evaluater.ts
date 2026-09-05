import type {
  Card,
  EvaluatedHand,
  Rank,
} from "./types.ts";

const rankValues: Record<Rank, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  "11": 11,
  "12": 12,
  "13": 13,
  "14": 14,
};

function combinations(
  cards: Card[],
  size: number
): Card[][] {
  const result: Card[][] = [];

  function generate(
    start: number,
    current: Card[]
  ): void {
    if (current.length === size) {
      result.push([...current]);
      return;
    }

    for (
      let i = start;
      i < cards.length;
      i++
    ) {
      current.push(cards[i]!);

      generate(
        i + 1,
        current
      );

      current.pop();
    }
  }

  generate(0, []);

  return result;
}

function evaluateFiveCards(
  cards: Card[]
): EvaluatedHand {
  const values = cards
    .map(card => rankValues[card.rank])
    .sort((a, b) => b - a);

  const counts = new Map<number, number>();

  for (const value of values) {
    counts.set(
      value,
      (counts.get(value) ?? 0) + 1
    );
  }

  const groups = [...counts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }

      return b[0] - a[0];
    });

  const flush =
    cards.every(
      card => card.suit === cards[0]!.suit
    );

  const straightHigh =
    getStraightHigh(values);

  // Royal Flush
  if (
    flush &&
    straightHigh === 14
  ) {
    return {
      rank: "royal-flush",
      score: [10, 14],
      cards,
    };
  }

  // Straight Flush
  if (
    flush &&
    straightHigh !== null
  ) {
    return {
      rank: "straight-flush",
      score: [9, straightHigh],
      cards,
    };
  }

  // Four of a Kind
  if (groups[0]![1] === 4) {
    const fourValue = groups[0]![0];

    const kicker =
      values.find(value =>
        value !== fourValue
      )!;

    return {
      rank: "four-of-a-kind",
      score: [
        8,
        fourValue,
        kicker,
      ],
      cards,
    };
  }

  // Full House
  if (
    groups[0]![1] === 3 &&
    groups[1]![1] === 2
  ) {
    return {
      rank: "full-house",
      score: [
        7,
        groups[0]![0],
        groups[1]![0],
      ],
      cards,
    };
  }

  // Flush
  if (flush) {
    return {
      rank: "flush",
      score: [
        6,
        ...values,
      ],
      cards,
    };
  }

  // Straight
  if (straightHigh !== null) {
    return {
      rank: "straight",
      score: [
        5,
        straightHigh,
      ],
      cards,
    };
  }

  // Three of a kind
  if (groups[0]![1] === 3) {
    const threeValue = groups[0]![0];

    const kickers = values
      .filter(value =>
        value !== threeValue
      )
      .sort((a, b) => b - a);

    return {
      rank: "three-of-a-kind",
      score: [
        4,
        threeValue,
        ...kickers,
      ],
      cards,
    };
  }

  // Two pair
  const pairs = groups
    .filter(([, count]) => count === 2)
    .map(([value]) => value)
    .sort((a, b) => b - a);

  if (pairs.length === 2) {
    const kicker = values.find(
      value =>
        value !== pairs[0] &&
        value !== pairs[1]
    )!;

    return {
      rank: "two-pair",
      score: [
        3,
        pairs[0]!,
        pairs[1]!,
        kicker,
      ],
      cards,
    };
  }

  // One pair
  if (pairs.length === 1) {
    const pairValue = pairs[0]!;

    const kickers = values
      .filter(value =>
        value !== pairValue
      )
      .sort((a, b) => b - a);

    return {
      rank: "pair",
      score: [
        2,
        pairValue,
        ...kickers,
      ],
      cards,
    };
  }

  // High card
  return {
    rank: "high-card",
    score: [
      1,
      ...values,
    ],
    cards,
  };
}

function getStraightHigh(
  values: number[]
): number | null {
  const unique = [
    ...new Set(values)
  ].sort((a, b) => b - a);

  // Wheel:
  // A 2 3 4 5
  if (
    unique.includes(14) &&
    unique.includes(5) &&
    unique.includes(4) &&
    unique.includes(3) &&
    unique.includes(2)
  ) {
    return 5;
  }

  for (
    let i = 0;
    i <= unique.length - 5;
    i++
  ) {
    const high = unique[i]!;

    if (
      unique[i + 1] === high - 1 &&
      unique[i + 2] === high - 2 &&
      unique[i + 3] === high - 3 &&
      unique[i + 4] === high - 4
    ) {
      return high;
    }
  }

  return null;
}

export function evaluateHand(
  cards: Card[]
): EvaluatedHand {
  if (cards.length !== 7) {
    throw new Error(
      "Texas Hold'em requires exactly 7 cards"
    );
  }

  const possibleHands =
    combinations(cards, 5);

  let bestHand =
    evaluateFiveCards(
      possibleHands[0]!
    );

  for (
    let i = 1;
    i < possibleHands.length;
    i++
  ) {
    const hand =
      evaluateFiveCards(
        possibleHands[i]!
      );

    if (
      compareHands(hand, bestHand) > 0
    ) {
      bestHand = hand;
    }
  }

  return bestHand;
}

export function compareHands(
  a: EvaluatedHand,
  b: EvaluatedHand
): number {
  const length = Math.max(
    a.score.length,
    b.score.length
  );

  for (let i = 0; i < length; i++) {
    const aValue = a.score[i] ?? 0;
    const bValue = b.score[i] ?? 0;

    if (aValue > bValue) {
      return 1;
    }

    if (aValue < bValue) {
      return -1;
    }
  }

  return 0;
}