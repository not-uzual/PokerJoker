export const pokerHelpGuide = {
  "guide": {
    "title": "Poker Help Guide",
    "version": "1.0",
    "focus_variant": "Texas Hold'em",
    "introduction": {
      "what_is_poker": "Poker is a family of card games where players bet on who holds the best hand, or who can convince others to fold. It combines luck, probability, psychology, and strategy.",
      "goal": "Win chips (the pot) either by having the best five-card hand at showdown or by making every other player fold.",
      "players": {
        "minimum": 2,
        "recommended": "2-9 at a full table",
        "maximum_typical": 10
      },
      "deck": "Standard 52-card deck, no jokers",
      "why_texas_holdem": "Texas Hold'em is the most popular poker variant in the world and is used in most major tournaments."
    },
    "equipment": {
      "cards": "One standard 52-card deck (4 suits: Spades, Hearts, Diamonds, Clubs; 13 ranks each)",
      "card_rank_low_to_high": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
      "ace_note": "Ace is usually high, but can also be low to complete the straight A-2-3-4-5 (the 'wheel').",
      "chips": "Used to represent bets. Each player starts with an equal stack.",
      "dealer_button": "A marker showing the nominal dealer. It moves one seat clockwise after every hand.",
      "suits_note": "Suits have no rank in Hold'em. If two hands are identical in rank, the pot is split."
    },
    "hand_rankings": {
      "description": "Hands are made from the best five cards out of your two hole cards and the five community cards. Listed from strongest to weakest.",
      "rankings": [
        {
          "rank": 1,
          "name": "Royal Flush",
          "description": "A, K, Q, J, 10, all of the same suit.",
          "example": "A♠ K♠ Q♠ J♠ 10♠"
        },
        {
          "rank": 2,
          "name": "Straight Flush",
          "description": "Five consecutive cards of the same suit.",
          "example": "9♥ 8♥ 7♥ 6♥ 5♥"
        },
        {
          "rank": 3,
          "name": "Four of a Kind",
          "description": "Four cards of the same rank plus one extra card (kicker).",
          "example": "K♠ K♥ K♦ K♣ 4♠"
        },
        {
          "rank": 4,
          "name": "Full House",
          "description": "Three cards of one rank plus two cards of another rank.",
          "example": "J♠ J♥ J♦ 8♣ 8♠"
        },
        {
          "rank": 5,
          "name": "Flush",
          "description": "Any five cards of the same suit, not in sequence.",
          "example": "A♦ J♦ 9♦ 6♦ 3♦"
        },
        {
          "rank": 6,
          "name": "Straight",
          "description": "Five consecutive cards of mixed suits.",
          "example": "10♣ 9♦ 8♠ 7♥ 6♣"
        },
        {
          "rank": 7,
          "name": "Three of a Kind",
          "description": "Three cards of the same rank and two unrelated cards.",
          "example": "7♠ 7♥ 7♦ K♣ 2♠"
        },
        {
          "rank": 8,
          "name": "Two Pair",
          "description": "Two cards of one rank, two cards of another rank, plus one extra card.",
          "example": "Q♠ Q♦ 5♣ 5♥ A♠"
        },
        {
          "rank": 9,
          "name": "One Pair",
          "description": "Two cards of the same rank and three unrelated cards.",
          "example": "10♠ 10♦ A♣ 7♥ 3♠"
        },
        {
          "rank": 10,
          "name": "High Card",
          "description": "No matching cards. The highest card plays.",
          "example": "A♠ J♦ 8♣ 5♥ 2♠"
        }
      ],
      "tie_breaking": "If two players hold the same hand type, the higher-ranking cards win. If still tied, the kicker (highest unmatched card) decides. If everything is equal, the pot is split."
    },
    "game_setup": {
      "positions": {
        "dealer_button": "Marks the last player to act after the flop. Rotates clockwise each hand.",
        "small_blind": "The player to the left of the dealer. Posts a forced half-bet.",
        "big_blind": "The player to the left of the small blind. Posts a forced full minimum bet.",
        "under_the_gun": "The first player to act before the flop (left of big blind)."
      },
      "blinds": {
        "purpose": "Forced bets that create an initial pot so there is something to play for.",
        "example": "In a $1/$2 game, small blind = $1 and big blind = $2."
      },
      "ante": "Some games and tournaments also require every player to post a small ante each hand."
    },
    "how_to_play": {
      "overview": "A hand of Texas Hold'em has four betting rounds: pre-flop, flop, turn, and river, followed by a showdown.",
      "steps": [
        {
          "step": 1,
          "name": "Post the Blinds",
          "description": "The small blind and big blind put their forced bets in the pot."
        },
        {
          "step": 2,
          "name": "Deal Hole Cards",
          "description": "Each player receives two private cards face down, dealt clockwise starting from the small blind."
        },
        {
          "step": 3,
          "name": "Pre-Flop Betting Round",
          "description": "Starting with the player left of the big blind, each player can fold, call the big blind, or raise. The big blind has the option to raise when action returns to them."
        },
        {
          "step": 4,
          "name": "The Flop",
          "description": "The dealer discards one card (the 'burn') and deals three community cards face up. A second betting round starts with the first active player left of the dealer button."
        },
        {
          "step": 5,
          "name": "The Turn",
          "description": "One card is burned and a fourth community card is dealt face up. A third betting round follows. Bets are usually larger now."
        },
        {
          "step": 6,
          "name": "The River",
          "description": "One card is burned and the fifth and final community card is dealt. The final betting round takes place."
        },
        {
          "step": 7,
          "name": "Showdown",
          "description": "If two or more players remain after the last betting round, they reveal their cards. The best five-card hand wins the pot. The player who made the last aggressive action usually shows first."
        },
        {
          "step": 8,
          "name": "Next Hand",
          "description": "The dealer button moves one seat clockwise and a new hand begins."
        }
      ],
      "winning_without_showdown": "If every other player folds, the remaining player wins the pot immediately and does not need to show their cards."
    },
    "player_actions": {
      "check": {
        "description": "Pass the action without betting. Only allowed when there is no bet to call."
      },
      "bet": {
        "description": "Put the first wager of a betting round into the pot."
      },
      "call": {
        "description": "Match the current bet made by another player."
      },
      "raise": {
        "description": "Increase the current bet. Other players must call the new amount, re-raise, or fold.",
        "minimum_raise_rule": "A raise must be at least as large as the previous bet or raise in that round."
      },
      "fold": {
        "description": "Discard your hand and give up any claim to the pot. You cannot win this hand."
      },
      "all_in": {
        "description": "Bet all of your remaining chips. You can only win the portion of the pot you matched. Extra bets from other players go into a side pot."
      }
    },
    "betting_structures": [
      {
        "name": "No-Limit",
        "description": "You can bet any amount up to your whole stack at any time. Most popular format."
      },
      {
        "name": "Pot-Limit",
        "description": "The maximum bet or raise is the current size of the pot."
      },
      {
        "name": "Fixed-Limit",
        "description": "Bets and raises are fixed amounts, with a cap on the number of raises per round."
      }
    ],
    "side_pots": {
      "description": "When a player is all-in for less than other players' bets, a side pot is created for the remaining players.",
      "example": "Player A goes all-in with $50. Players B and C each bet $100. The main pot (A, B, C) is $150 and the side pot (B, C only) holds the extra $100 each. A can only win the main pot."
    },
    "key_terms": [
      { "term": "Hole Cards", "meaning": "Your two private cards." },
      { "term": "Community Cards", "meaning": "The five shared cards on the table." },
      { "term": "Board", "meaning": "Another name for the community cards." },
      { "term": "Pot", "meaning": "Total chips bet in the current hand." },
      { "term": "Kicker", "meaning": "An unpaired side card used to break ties." },
      { "term": "Nuts", "meaning": "The best possible hand given the board." },
      { "term": "Bluff", "meaning": "Betting with a weak hand to make opponents fold." },
      { "term": "Tilt", "meaning": "Playing emotionally and poorly after a bad result." },
      { "term": "Outs", "meaning": "Cards remaining in the deck that would improve your hand." },
      { "term": "Pot Odds", "meaning": "Ratio of the pot size to the cost of a call." },
      { "term": "Position", "meaning": "Where you sit relative to the dealer. Later position is an advantage." },
      { "term": "Muck", "meaning": "To discard or fold your hand face down." }
    ],
    "example_hand": {
      "setup": "Blinds are $1/$2. You are dealt A♠ K♠ and raise to $6. One player calls.",
      "flop": "Q♠ 9♠ 3♦ — you have a flush draw plus overcards. You bet $10 and your opponent calls.",
      "turn": "7♣ — you check and your opponent checks.",
      "river": "2♠ — you complete your Ace-high flush. You bet $25 and your opponent calls.",
      "showdown": "You show A♠ K♠ Q♠ 9♠ 2♠ (flush). Opponent shows a pair of queens. You win the pot."
    },
    "variants": [
      {
        "name": "Omaha",
        "summary": "Each player gets four hole cards and must use exactly two of them with exactly three community cards."
      },
      {
        "name": "Seven-Card Stud",
        "summary": "No community cards. Each player gets seven cards, some face down and some face up, and makes the best five-card hand."
      },
      {
        "name": "Five-Card Draw",
        "summary": "Each player gets five private cards and can swap some of them for new ones once."
      },
      {
        "name": "Short Deck (6+)",
        "summary": "Texas Hold'em played with cards 2 to 5 removed. A flush beats a full house."
      }
    ],
    "basic_strategy_tips": [
      "Play fewer hands from early position and more from late position.",
      "Strong starting hands include big pairs (AA, KK, QQ) and big cards like AK and AQ.",
      "Pay attention to how opponents bet, not just your own cards.",
      "Do not chase draws when pot odds are poor.",
      "Manage your bankroll and only play with money you can afford to lose.",
      "Bluff selectively and against opponents who can fold.",
      "Folding is a normal and profitable part of the game."
    ],
    "etiquette": [
      "Act in turn and do not reveal your cards before showdown unless required.",
      "Do not discuss your hand during play.",
      "Keep your chips visible and in neat stacks.",
      "Declare verbal bets clearly. Verbal declarations are generally binding.",
      "Be polite and avoid slow-rolling (deliberately delaying showing a winning hand).",
      "Do not splash the pot (throw chips directly into the pot). Place them in front of you."
    ],
    "common_mistakes": [
      "Playing too many hands",
      "Calling too often without a plan",
      "Ignoring position",
      "Bluffing too frequently",
      "Playing on tilt",
      "Playing stakes that are too high for your bankroll"
    ],
    "responsible_gaming": {
      "note": "Poker involves risk. Set a budget and time limit before you play, never chase losses, and take breaks. If gambling stops being fun, seek help from a local support service."
    },
    "faq": [
      {
        "question": "What beats what?",
        "answer": "See the hand_rankings section. Royal Flush is the highest, High Card is the lowest."
      },
      {
        "question": "Can I use both hole cards in Texas Hold'em?",
        "answer": "You can use both, one, or none of your hole cards. You always make the best five-card hand from all seven available cards."
      },
      {
        "question": "What if two players have the same hand?",
        "answer": "Compare kickers. If they are still equal, the pot is split."
      },
      {
        "question": "What does 'playing the board' mean?",
        "answer": "Your best five-card hand uses only the five community cards, so your hole cards do not improve it."
      },
      {
        "question": "Is a flush or a straight stronger?",
        "answer": "A flush beats a straight."
      }
    ]
  }
}