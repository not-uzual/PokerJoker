"use client";

import ChipsBox from "@/components/bettingControls";
import PokerTable from "@/components/pokerTable";
import { getPlayerId, getPlayerRoomData } from "@/lib/player";
import { PLAYER_ACTION_DURATION_SECONDS } from "@/lib/gameConfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useGame } from "./contexts/gameContext";
import ChatBox, {
  type ChatMessage,
  type GameLogEntry,
  type ReactionMessage,
} from "./chatBox";
import reactionSounds from "@/constents/reactions";

const reactions = [
  "Are you crazy...",
  "Achha ji aisa hai kya...",
  "Baby laughing",
  "Cat laughing",
  "Chalooo",
  "Gunshot",
  "Eiiyaaaanhhhhh...",
  "Jo gareeb hove hai...",
  "Angen ghatram...",
  "Rez laugh",
  "Imposter",
  "Doraemon",
  "Happy Happy Happy",
  "Light Yagami Laught",
  "OOOOHHHHHHHHHHH"
];

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
  players: Array<Player>;
  showdownResults: Array<{
    playerId: string;
    amountWon: number;
    hand: { rank: string; cards: Card[] } | null;
  }>;
  logs: GameLogEntry[];
};

type Player = {
  id: string;
  name: string;
  chips: number;
  currentBet: number;
  totalBet: number;
  hand: Card[];
  folded: boolean;
  allIn: boolean;
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
  const router = useRouter();
  const { isJoined, setIsJoined } = useGame();
  const [canOpen, setCanOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [reactionIndex, setReactionIndex] = useState<number>(-1);
  const [playerId] = useState(() =>
    typeof window === "undefined" ? "" : getPlayerId(),
  );
  const [roomData] = useState<{ hostId?: string; players?: RoomPlayer[] }>(
    () => (typeof window === "undefined" ? {} : getPlayerRoomData()),
  );

  const [normalView, setNormalView] = useState(true);
  const screenMinH = normalView ? 600 : 800;
  const screenMinW = normalView ? 800 : 1000;

  useEffect(() => {
    if (gameState?.phase === "starting") {
      playSound("/startGame.mp3");
    }
  }, [gameState]);

  useEffect(() => {
    const checkSize = () => {
      setCanOpen(
        window.innerWidth > screenMinW && window.innerHeight > screenMinH,
      );
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, [screenMinH, screenMinW]);

  useEffect(() => {
    const currentPlayerId = getPlayerId();
    const handleGameState = (state: GameState) => setGameState(state);
    const handleGameError = ({ message }: { message: string }) =>
      console.error(message);
    const handleChatMessages = (messages: ChatMessage[]) =>
      setChatMessages(messages);
    const handleChatMessage = (chatMessage: ChatMessage) =>
      setChatMessages((current) => [...current, chatMessage].slice(-30));
    const handleChatReaction = (reaction: ReactionMessage) => {
      playSound(reactionSounds[reaction.reactionIndex]);
    };
    const handlePlayerKicked = ({ message }: { message: string }) => {
      handleRoomLeft();
      window.alert(message);
    };
    const handleRoomLeft = () => {
      localStorage.clear();
      setIsJoined(false);
      router.replace("/");
    };

    socket.on("game-state", handleGameState);
    socket.on("game-error", handleGameError);
    socket.on("chat-messages", handleChatMessages);
    socket.on("chat-message", handleChatMessage);
    socket.on("chat-reaction", handleChatReaction);
    socket.on("player-kicked", handlePlayerKicked);
    socket.on("room-left", handleRoomLeft);
    socket.emit("register-player", { playerId: currentPlayerId });

    return () => {
      socket.off("game-state", handleGameState);
      socket.off("game-error", handleGameError);
      socket.off("chat-messages", handleChatMessages);
      socket.off("chat-message", handleChatMessage);
      socket.off("chat-reaction", handleChatReaction);
      socket.off("player-kicked", handlePlayerKicked);
      socket.off("room-left", handleRoomLeft);
    };
  }, [router]);

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
    socket.emit("start-game", { roomId, playerId });
  }

  function sendChatMessage() {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const removeCommand = trimmedMessage.match(/^joker kick\s+(.+)$/i);
    if (removeCommand) {
      const targetName = removeCommand[1]?.trim();
      const target = gameState?.players.find(
        (player) => player.name.toLowerCase() === targetName?.toLowerCase(),
      );
      if (!target) {
        console.error("Player not found");
      } else {
        socket.emit("kick-player", {
          roomId,
          playerId,
          targetPlayerId: target.id,
        });
      }
      setMessage("");
      return;
    }

    socket.emit("send-chat-message", {
      roomId,
      playerId,
      message: trimmedMessage,
    });
    setMessage("");
  }

  function sendReaction() {
    if (reactionIndex == -1) return;
    console.log(reactionIndex);
    socket.emit("send-reaction", { roomId, playerId, reactionIndex });
    const message = `reacted ${reactions[reactionIndex]}`;
    socket.emit("send-chat-message", { roomId, playerId, message });
    setReactionIndex(-1);
  }

  function leaveRoom() {
    setIsJoined(false);
    localStorage.clear();
    router.push("/");
    socket.emit("leave-room", { roomId, playerId });
  }

  if (!canOpen) {
    return (
      <>
        <div className="text-white">Screen is too small...</div>
        <button
          onClick={() => {
            setNormalView((current) => !current);
          }}
          className={`absolute top-15 right-40 w-15 flex items-center rounded-sm cursor-pointer ${normalView ? "bg-white" : "bg-purple-700"} transition-all`}
        >
          <div
            className={`w-10 flex items-center justify-center font-bold transition-transform duration-200 text-xl ${
              normalView ? "-translate-x-1" : "translate-x-6"
            }`}
          >
            {normalView ? "♠️" : "🥃"}
          </div>
        </button>
      </>
    );
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
              isBankrupt: player.chips === 0,
            })) ??
            roomData.players ??
            []
          }
          activePlayerId={activePlayerId}
          toggleView={normalView}
          setToggleView={() => setNormalView((current) => !current)}
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

      {gameState && (
        <ChatBox
          logs={gameState.logs}
          chatMessages={chatMessages}
          message={message}
          onMessageChange={setMessage}
          onReactionChange={setReactionIndex}
          onSendMessage={sendChatMessage}
          onSendReaction={sendReaction}
          reactions={reactions}
        />
      )}

      <button
        type="button"
        onClick={leaveRoom}
        className="absolute right-20 top-15 rounded-sm bg-white p-2 font-bold text-red-600 hover:bg-red-300"
      >
        Leave
      </button>

      <button
        onClick={() => {
          setNormalView((current) => !current);
        }}
        className={`absolute top-15 right-40 w-15 flex items-center rounded-sm cursor-pointer ${normalView ? "bg-white" : "bg-purple-700"} transition-all`}
      >
        <div
          className={`w-10 flex items-center justify-center font-bold transition-transform duration-200 text-xl ${
            normalView ? "-translate-x-1" : "translate-x-6"
          }`}
        >
          {normalView ? "♠️" : "🥃"}
        </div>
      </button>
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
