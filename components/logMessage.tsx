import Image from "next/image";

type LogCard = {
	suit: "H" | "D" | "C" | "S";
	rank: string;
};

export type GameLogEntry = {
	playerId: string;
	playerName: string;
	action: "fold" | "check" | "call" | "bet" | "raise" | "all-in" | "win";
	amount?: number;
	hand?: {
		rank: string;
		cards: LogCard[];
	};
};

function actionText(entry: GameLogEntry): string {
	if (entry.action === "win") return `won $${entry.amount ?? 0} pot`;
	if (entry.action === "check" || entry.action === "fold") return entry.action;
	if (entry.action === "all-in") return `went all-in for $${entry.amount ?? 0}`;
	return `${entry.action} $${entry.amount ?? 0}`;
}

export default function LogMessage({ logs }: { logs: GameLogEntry[] }) {
	return (
		<aside className="absolute -left-50 bottom-30 z-20 w-64 text-white">
			<div className="space-y-2">
				{logs.map((entry, index) => (
					<div
						key={`${entry.playerId}-${entry.action}-${index}`}
						className="rounded-sm bg-black/75 p-2 text-sm"
					>
						<div>
							<span className="font-bold">{entry.playerName}</span>{" "}
							<span>{actionText(entry)}</span>
						</div>
						{entry.hand && (
							<div className="mt-1 flex items-center gap-1">
								<span className="text-base text-yellow-300">
									{entry.hand.rank.toUpperCase()}
								</span>
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
						)}
					</div>
				))}
			</div>
		</aside>
	);
}
