"use client";

import { useState } from "react";

type BettingControlsProps = {
  currentBet: number;
  playerBet: number;
  minRaise: number;
  maxBet: number;

  onFold: () => void;
  onCheck: () => void;
  onCall: () => void;
  onBet: (amount: number) => void;
  onAllIn: () => void;
};

export default function BettingControls({
  currentBet,
  playerBet,
  minRaise,
  maxBet,
  onFold,
  onCheck,
  onCall,
  onBet,
  onAllIn,
}: BettingControlsProps) {
  const callAmount = Math.max(0, currentBet - playerBet);
  const minimumBet = currentBet === 0 ? minRaise : currentBet + minRaise;
  const canRaise = maxBet >= minimumBet;

  const [betAmount, setBetAmount] = useState(
    Math.min(minimumBet, maxBet)
  );

  const canCheck = callAmount === 0;

  return (
    <div className="absolute z-20 right-10 bottom-5 rounded-2xl bg-zinc-900 p-4 text-white">
      
      {/* Bet amount */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-zinc-400">
          {canCheck ? "Check" : "Call"}
        </span>

        <span className="text-xl font-bold">
          ${canCheck ? 0 : callAmount}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={canRaise ? minimumBet : maxBet}
        max={maxBet}
        value={Math.min(Math.max(betAmount, canRaise ? minimumBet : maxBet), maxBet)}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        className="w-full"
        disabled={!canRaise}
      />

      {/* Amount controls */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          onClick={() =>
            setBetAmount((amount) =>
              Math.max(canRaise ? minimumBet : maxBet, amount - minRaise)
            )
          }
          className="size-10 rounded-full bg-zinc-700 text-xl"
        >
          −
        </button>

        <span className="min-w-24 text-center text-2xl font-bold">
          ${betAmount}
        </span>

        <button
          onClick={() =>
            setBetAmount((amount) =>
              Math.min(maxBet, amount + minRaise)
            )
          }
          className="size-10 rounded-full bg-zinc-700 text-xl"
        >
          +
        </button>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        
        <button
          onClick={onFold}
          className="rounded-xl bg-red-600 px-4 py-3 font-bold"
        >
          Fold
        </button>

        {canCheck ? (
          <button
            onClick={onCheck}
            className="rounded-xl bg-zinc-700 px-4 py-3 font-bold"
          >
            Check
          </button>
        ) : (
          <button
            onClick={onCall}
            className="rounded-xl bg-blue-600 px-4 py-3 font-bold"
          >
            Call ${callAmount}
          </button>
        )}

        {canRaise ? <button onClick={() => onBet(betAmount)} className="rounded-xl bg-green-600 px-4 py-3 font-bold">
          {currentBet === 0 ? "Bet" : "Raise"} ${betAmount}
        </button> : <button onClick={onAllIn} className="rounded-xl bg-green-600 px-4 py-3 font-bold">All in</button>}

      </div>
    </div>
  );
}
