type LeaderboardPlayer = {
  id: string;
  name: string;
  chips: number;
};

type PlayerLeaderboardProps = {
  players: LeaderboardPlayer[];
};

const rankStyles = [
  "border-yellow-300/60 bg-gradient-to-r from-yellow-500/35 to-amber-300/15",
  "border-slate-200/50 bg-gradient-to-r from-slate-300/30 to-zinc-100/10",
  "border-orange-400/50 bg-gradient-to-r from-orange-600/30 to-amber-800/15",
];

const rankLabels = ["1st", "2nd", "3rd"];

export default function PlayerLeaderboard({ players }: PlayerLeaderboardProps) {
  const leaders = [...players]
    .sort((a, b) => b.chips - a.chips || a.name.localeCompare(b.name))
    .slice(0, 3);

  if (leaders.length === 0) return null;

  return (
    <aside
      aria-label="Top players by chips"
      className="absolute left-15 top-40 z-20 w-44 -translate-y-1/2 rounded-xl border border-white/15 bg-zinc-950/90 p-3 text-white shadow-xs shadow-white backdrop-blur-sm"
    >
      <h2 className="mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
        Leaderboard
      </h2>
      <ol className="flex flex-col gap-2">
        {leaders.map((player, index) => (
          <li
            key={player.id}
            className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 ${rankStyles[index]}`}
          >
            <span className="grid h-7 min-w-8 shrink-0 place-items-center rounded-full bg-black/30 px-1 text-xs font-black text-white">
              {rankLabels[index]}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
              {player.name}
            </span>
            <span className="shrink-0 text-xs font-bold tabular-nums">
              {"$"+player.chips.toLocaleString()}
            </span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
