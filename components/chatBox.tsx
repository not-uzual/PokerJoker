import Image from "next/image";
import { useEffect, useRef } from "react";
import ReactionDropdown from "./reactionDropdown";

type LogCard = {
  suit: "H" | "D" | "C" | "S";
  rank: string;
};

export type GameLogEntry = {
  createdAt: number;
  playerId: string;
  playerName: string;
  action: "fold" | "check" | "call" | "bet" | "raise" | "all-in" | "win";
  amount?: number;
  hand?: {
    rank: string;
    cards: LogCard[];
  };
};

export type ChatMessage = {
  id: string;
  createdAt: number;
  playerId: string;
  playerName: string;
  message: string;
  kind?: "system";
};

export type ReactionMessage = {
  id: string;
  createdAt: number;
  playerId: string;
  playerName: string;
  reactionIndex: number;
};

function actionText(entry: GameLogEntry): string {
  if (entry.action === "win") return `won $${entry.amount ?? 0} pot`;
  if (entry.action === "check" || entry.action === "fold") return entry.action;
  if (entry.action === "all-in") return `went all-in for $${entry.amount ?? 0}`;
  return `${entry.action} $${entry.amount ?? 0}`;
}

export default function ChatBox({
  logs,
  chatMessages,
  reactions,
  message,
  onMessageChange,
  onReactionChange,
  onSendMessage,
  onSendReaction
}: {
  logs: GameLogEntry[];
  chatMessages: ChatMessage[];
  reactions: string[]
  message: string;
  onMessageChange: (message: string) => void;
  onReactionChange: (i: number) => void;
  onSendMessage: () => void;
  onSendReaction: () => void;
}) {
  const history = [
    ...logs.map((entry) => ({ type: "system" as const, entry })),
    ...chatMessages.map((entry) => ({
      type:
        entry.kind === "system" ? ("system-chat" as const) : ("chat" as const),
      entry,
    })),
  ]
    .sort((left, right) => left.entry.createdAt - right.entry.createdAt)
    .slice(-30);
  const historyRef = useRef<HTMLDivElement>(null);
  const latestMessage = history[history.length - 1];
  const latestMessageKey = latestMessage
    ? `${latestMessage.type}-${latestMessage.entry.createdAt}`
    : "empty";

  useEffect(() => {
    const container = historyRef.current;
    if (!container) return;

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [latestMessageKey]);

  return (
    <aside className="absolute bottom-15 left-5 z-20 flex flex-col gap-2 text-white w-74 whitespace-normal">
      <div
        ref={historyRef}
        className="relative max-h-82 space-y-2 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {history.map(({ type, entry }) =>
          type === "system" ? (
            <div
              key={`system-${entry.createdAt}-${entry.playerId}-${entry.action}`}
              className="rounded-sm p-2 text-sm"
            >
              <div>
                <span className="font-bold text-red-400">system:</span>{" "}
                <span>
                  {entry.playerName} {actionText(entry)}
                </span>
              </div>
              {entry.hand && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base text-yellow-300">
                    {entry.hand.rank.toUpperCase()}
                  </span>
                  <div className="flex-1 flex items-center gap-1">
                    {entry.hand.cards.map((card) => (
                      <Image
                        key={`${card.suit}-${card.rank}`}
                        src={`/52Deck/${card.suit}${card.rank}.png`}
                        alt={`${card.suit} ${card.rank}`}
                        width={54}
                        height={81}
                        className="rounded-xs"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : type === "system-chat" ? (
            <div key={entry.id} className="rounded-sm p-2 text-sm">
              <span className="font-bold text-red-400">system:</span>{" "}
              <span>{entry.message}</span>
            </div>
          ) : (
            <div key={entry.id} className="rounded-sm p-2 text-sm">
              <span className="font-bold text-blue-400">
                {entry.playerName}:
              </span>{" "}
              <span>{entry.message}</span>
            </div>
          ),
        )}
      </div>
      <div className="flex-1 flex gap-1">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSendMessage();
          }}
          className="flex-1 flex"
        >
          <input
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            maxLength={240}
            placeholder="Message room"
            className="min-w-0 flex-1 rounded-sm bg-black/75 px-2 py-1 text-sm text-white outline-none placeholder:text-zinc-400 border-b-2 border-b-violet-500"
          />
        </form>
        <ReactionDropdown 
          reactions={reactions}
          onChangeReaction={onReactionChange}
          onSendReaction={onSendReaction}/>
      </div>
    </aside>
  );
}
