import PokerT from "@/public/PokerTable.png";
import Dealer from "@/public/Dealer.png";
import CardBack from "@/public/Card.png";
import Image from "next/image";
import Player from "./player";
import { boardCardPositions, playerPositions } from "@/lib/position";

type Card = {
  suit: "H" | "D" | "C" | "S";
  rank: string;
};

type PokerTableProps = {
  communityCards: Card[];
  holeCards: Card[];
  players: Array<{ playerId: string; name: string }>;
  activePlayerId?: string;
};

function cardSource(card: Card): string {
  return `/52Deck/${card.suit}${card.rank}.png`;
}

export default function PokerTable({
  communityCards,
  holeCards,
  players,
  activePlayerId,
}: PokerTableProps) {
  return (
    <>
      <div className="flex-1 flex justify-center items-center">
        <Image
          src={PokerT}
          alt="Poker Table"
          className="size-[70dvh]"
          loading="eager"
        />
        <Image
          src={Dealer}
          alt="Dealer"
          className="absolute -z-10 top-3 h-38.5 w-[108.5px]"
        />
        {playerPositions.map((position, index) => {
          const player = players[index];

          return (
            <Player
              key={player?.playerId ?? `empty-${index}`}
              x={position.x}
              y={position.y}
              name={player?.name}
              isOccupied={Boolean(player)}
              isActive={player?.playerId === activePlayerId}
              isDealer={false}
            />
          );
        })}

        {boardCardPositions.map((position, index) => {
          const card = communityCards[index];

          return (
            <Image
              key={card ? `${card.suit}-${card.rank}` : `empty-${index}`}
              src={card ? cardSource(card) : CardBack}
              alt={
                card ? `${card.suit} ${card.rank}` : "Undealt community card"
              }
              width={40}
              height={60}
              className="absolute h-15 w-10 rounded-[3px]"
              style={{ left: position.left > 0 ? position.left : undefined }}
            />
          );
        })}
        {holeCards.length > 0 && (
          <div className="absolute -right-20 z-20 flex gap-2">
            {holeCards.map((card) => (
              <Image
                key={`${card.suit}-${card.rank}`}
                src={cardSource(card)}
                alt={`${card.suit} ${card.rank}`}
                width={80}
                height={120}
                className="rounded-sm"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
