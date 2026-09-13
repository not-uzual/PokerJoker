import PokerT from "@/public/PokerTable.png";
import Dealer from "@/public/Dealer.png";
import CardBack from "@/public/Card.png";
import Image from "next/image";
import Player from "./player";
import {
  boardCardPositions,
  playerPositions,
  playerPositionsNormal,
} from "@/lib/position";

type Card = {
  suit: "H" | "D" | "C" | "S";
  rank: string;
};

type PokerTableProps = {
  communityCards: Card[];
  holeCards: Card[];
  players: Array<{ playerId: string; name: string; isBankrupt?: boolean }>;
  activePlayerId?: string;
  toggleView: boolean;
  setToggleView: () => void;
};

function cardSource(card: Card): string {
  return `/52Deck/${card.suit}${card.rank}.png`;
}

export default function PokerTable({
  communityCards,
  holeCards,
  players,
  activePlayerId,
  toggleView,
  setToggleView,
}: PokerTableProps) {
  return (
    <>
      <div className="flex-1 flex justify-center items-center">
        {!toggleView && (
          <Image
            src={PokerT}
            alt="Poker Table"
            className="size-[70dvh]"
            loading="eager"
          />
        )}
        {!toggleView && (
          <Image
            src={Dealer}
            alt="Dealer"
            className="absolute -z-10 top-3 h-38.5 w-[108.5px]"
          />
        )}
        {toggleView
          ? playerPositionsNormal.map((position, index) => {
              const player = players[index];

              return (
                <Player
                  key={player?.playerId ?? `empty-${index}`}
                  x={position.x}
                  y={position.y}
                  name={player?.name}
                  isOccupied={Boolean(player)}
                  isBankrupt={player?.isBankrupt ?? false}
                  isActive={player?.playerId === activePlayerId}
                  isDealer={false}
                />
              );
            })
          : playerPositions.map((position, index) => {
              const player = players[index];

              return (
                <Player
                  key={player?.playerId ?? `empty-${index}`}
                  x={position.x}
                  y={position.y}
                  name={player?.name}
                  isOccupied={Boolean(player)}
                  isBankrupt={player?.isBankrupt ?? false}
                  isActive={player?.playerId === activePlayerId}
                  isDealer={false}
                />
              );
            })}

        {toggleView ? (
          <>
            <div className="absolute flex gap-1.5 bg-green-800 p-2 border-2 border-green-900 rounded-sm">
              {boardCardPositions.map((position, index) => {
                const card = communityCards[index];

                return (
                  <Image
                    key={card ? `${card.suit}-${card.rank}` : `empty-${index}`}
                    src={card ? cardSource(card) : CardBack}
                    alt={
                      card
                        ? `${card.suit} ${card.rank}`
                        : "Undealt community card"
                    }
                    width={60}
                    height={85}
                    className="rounded-[3px]"
                    style={{
                      left: position.left > 0 ? position.left : undefined,
                    }}
                  />
                );
              })}
            </div>
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
          </>
        ) : (
          <>
            <div className="absolute flex gap-1.5 bg-green-800 p-2 border-2 border-green-900 rounded-sm">
              {boardCardPositions.map((position, index) => {
                const card = communityCards[index];

                return (
                  <Image
                    key={card ? `${card.suit}-${card.rank}` : `empty-${index}`}
                    src={card ? cardSource(card) : CardBack}
                    alt={
                      card
                        ? `${card.suit} ${card.rank}`
                        : "Undealt community card"
                    }
                    width={50}
                    height={75}
                    className="rounded-[3px]"
                    style={{
                      left: position.left > 0 ? position.left : undefined,
                    }}
                  />
                );
              })}
            </div>
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
          </>
        )}
      </div>
    </>
  );
}
