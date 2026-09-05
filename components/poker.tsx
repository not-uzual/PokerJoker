"use client";

import ChipsBox from "@/components/bettingControls";
import PokerTable from "@/components/pokerTable";
import { getPlayerId, getPlayerRoomData } from "@/lib/player";
import { PLAYER_ACTION_DURATION_SECONDS } from "@/lib/gameConfig";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type Card = {
  suit: "H" | "D" | "C" | "S";
  rank: string;
};

type PokerGameProps = {
  roomId: string;
};

type RoomPlayer = {
  playerId: string;
  name: string;
};

type GameState = {
  phase: string;
  pot: number;
  currentBet: number;
  minRaise: number;
  currentPlayerIndex: number;
  dealerIndex: number;
  turnEndsAt: number | null;
  communityCards: Card[];
  players: Array<{
    id: string;
    name: string;
    chips: number;
    currentBet: number;
    totalBet: number;
    hand: Card[];
  }>;
  showdownResults: Array<{
    playerId: string;
    amountWon: number;
    hand: { rank: string } | null;
  }>;
};

function GameStatus({ gameState }: { gameState: GameState }) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(interval);
    };
  }, []);

  const secondsLeft = gameState.turnEndsAt
    ? Math.max(0, Math.ceil((gameState.turnEndsAt - now) / 1000))
    : null;

  return (
    <div className="absolute top-31 z-20 rounded-xl bg-zinc-900 px-4 py-2 text-center text-white">
      <div className="font-semibold">{gameState.phase.toUpperCase()}</div>
      {gameState.phase === "waiting" ? (
        <div className="text-sm text-zinc-300">
          Waiting for the players {gameState.players.length}/9
        </div>
      ) : gameState.phase === "starting" ? (
        <div className="text-sm text-zinc-300">Deals in {secondsLeft}s</div>
      ) : gameState.phase === "preview" ? (
        <div className="text-sm text-zinc-300">
          Ready to play in {secondsLeft}s
        </div>
      ) : gameState.phase === "finished" ? (
        <div className="text-sm text-zinc-300">One more Game</div>
      ) : (
        <div className="text-sm text-zinc-300">
          {`POT ${gameState.pot} `} Timer:{" "}
          {secondsLeft ?? PLAYER_ACTION_DURATION_SECONDS}s
        </div>
      )}
    </div>
  );
}

function PlayerStats({
  me,
  gameState,
}: {
  me: GameState["players"][number];
  gameState: GameState;
}) {
  const winnings = gameState.showdownResults.find(
    (result) => result.playerId === me.id,
  );
  return (
    <aside className="absolute right-10 bottom-5 z-20 min-w-52 rounded-2xl bg-zinc-900 p-4 text-white">
      <div className="mb-3 text-sm font-semibold text-zinc-300">
        Your table stats
      </div>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm">
        <dt className="text-zinc-400">Chips</dt>
        <dd className="text-right font-bold">${me.chips}</dd>
        <dt className="text-zinc-400">This round</dt>
        <dd className="text-right font-bold">${me.currentBet}</dd>
        <dt className="text-zinc-400">Total in pot</dt>
        <dd className="text-right font-bold">${me.totalBet}</dd>
        <dt className="text-zinc-400">Table pot</dt>
        <dd className="text-right font-bold">${gameState.pot}</dd>
        {winnings && (
          <>
            <dt className="text-emerald-400">Won</dt>
            <dd className="text-right font-bold text-emerald-400">
              +${winnings.amountWon}
              {winnings.hand ? ` · ${winnings.hand.rank}` : " · folded pot"}
            </dd>
          </>
        )}
      </dl>
    </aside>
  );
}

export default function PokerGame({ roomId }: PokerGameProps) {
  const [canOpen, setCanOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId] = useState(() =>
    typeof window === "undefined" ? "" : getPlayerId(),
  );
  const [roomData] = useState<{ hostId?: string; players?: RoomPlayer[] }>(
    () => (typeof window === "undefined" ? {} : getPlayerRoomData()),
  );
  useEffect(() => {
    const checkSize = () => {
      setCanOpen(window.innerWidth > 1000 && window.innerHeight > 800);
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    const currentPlayerId = getPlayerId();
    const handleGameState = (state: GameState) => setGameState(state);
    const handleGameError = ({ message }: { message: string }) =>
      console.error(message);

    socket.on("game-state", handleGameState);
    socket.on("game-error", handleGameError);
    socket.emit("register-player", { playerId: currentPlayerId });

    return () => {
      socket.off("game-state", handleGameState);
      socket.off("game-error", handleGameError);
    };
  }, []);

  function sendAction(action: { type: string; amount?: number }) {
    socket.emit("game-action", { roomId, playerId, action });
  }

  const me = gameState?.players.find((player) => player.id === playerId);
  const activePlayerId = gameState?.players[gameState.currentPlayerIndex]?.id;
  const isMyTurn =
    ["preflop", "flop", "turn", "river"].includes(gameState?.phase ?? "") &&
    activePlayerId === playerId;
  const isWaiting = gameState?.phase === "waiting";
  const canStartNextHand = isWaiting || gameState?.phase === "finished";

  function startGame() {
    playSound("/startGame.mp3");
    socket.emit("start-game", { roomId, playerId });
  }

  if (!canOpen) {
    return <div className="text-white">Screen is too small</div>;
  }
  return (
    <div className="flex-1 flex justify-center">
      <div className="relative h-200 w-250 flex justify-center items-center pt-5">
        <PokerTable
          communityCards={gameState?.communityCards ?? []}
          holeCards={me?.hand ?? []}
          players={
            gameState?.players.map((player) => ({
              playerId: player.id,
              name: player.name,
            })) ??
            roomData.players ??
            []
          }
          activePlayerId={activePlayerId}
        />
        {gameState && <GameStatus gameState={gameState} />}
        {canStartNextHand && roomData.hostId === playerId && (
          <button
            type="button"
            onClick={startGame}
            className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black px-6 py-3 font-bold text-white"
          >
            {gameState?.phase === "finished" ? "Start next hand" : "Start game"}
          </button>
        )}
      </div>
      {isMyTurn && me && (
        <ChipsBox
          currentBet={gameState?.currentBet ?? 0}
          playerBet={me.currentBet}
          minRaise={gameState?.minRaise ?? 0}
          maxBet={me.currentBet + me.chips}
          onFold={() => sendAction({ type: "fold" })}
          onBet={(amount) =>
            sendAction({
              type: gameState?.currentBet ? "raise" : "bet",
              amount,
            })
          }
          onCall={() => sendAction({ type: "call" })}
          onCheck={() => sendAction({ type: "check" })}
          onAllIn={() => sendAction({ type: "all-in" })}
        />
      )}
      {!isMyTurn && me && gameState && (
        <PlayerStats me={me} gameState={gameState} />
      )}
    </div>
  );
}

function playSound(audio: string): void {
  const sound = new Audio(audio);
  void sound.play().catch(() => {
    // Browsers may block playback until a user interaction; startGame is one,
    // but silently ignore an unavailable/muted audio device.
  });
}
