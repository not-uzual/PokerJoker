"use client";

import { useState } from "react";
import { pokerHelpGuide } from "@/lib/pokerGuide";

const guide = pokerHelpGuide.guide;

export default function PokerGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  function closeGuide() {
    setIsOpen(false);
    setIsPinned(false);
  }

  return (
    <div
      className="absolute right-60 top-15 z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        if (!isPinned) setIsOpen(false);
      }}
      onBlur={(event) => {
        if (
          !isPinned &&
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeGuide();
      }}
    >
      <button
        type="button"
        aria-label="Poker game guide"
        aria-expanded={isOpen}
        aria-controls="poker-guide-panel"
        onFocus={() => setIsOpen(true)}
        onClick={() => {
          if (isPinned) {
            closeGuide();
          } else {
            setIsPinned(true);
            setIsOpen(true);
          }
        }}
        className="grid size-7 place-items-center rounded-full border border-purple-300/40 bg-zinc-950 text-purple-200 shadow-lg transition hover:border-purple-300 hover:bg-purple-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>

      {isOpen && (
        <section
          id="poker-guide-panel"
          aria-label={guide.title}
          className="absolute right-0 top-12 flex max-h-[75dvh] w-[min(90vw,440px)] flex-col overflow-hidden rounded-2xl border border-purple-300/25 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/60"
        >
          <header className="flex items-start justify-between gap-4 border-b border-white/10 bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-950 px-5 py-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-purple-300">
                Quick reference · {guide.focus_variant}
              </p>
              <h2 className="text-xl font-black tracking-tight">{guide.title}</h2>
              <p className="mt-1 text-xs text-zinc-400">
                The essentials for your next hand.
              </p>
            </div>
            <button
              type="button"
              onClick={closeGuide}
              aria-label="Close poker guide"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-zinc-300 transition hover:bg-white/20 hover:text-white"
            >
              <span aria-hidden="true" className="text-xl leading-none">×</span>
            </button>
          </header>

          <div className="space-y-6 overflow-y-auto px-5 py-5 [scrollbar-width:thin] [scrollbar-color:#71717a_transparent]">
            <section className="rounded-xl border border-purple-300/15 bg-purple-950/30 p-4">
              <h3 className="mb-2 text-sm font-bold text-purple-200">The goal</h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                {guide.introduction.goal}
              </p>
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-zinc-400">
                {guide.introduction.what_is_poker}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                {guide.introduction.why_texas_holdem}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-zinc-300">
                  {guide.introduction.players.minimum}–{guide.introduction.players.maximum_typical} players
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-zinc-300">
                  {guide.introduction.deck}
                </span>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-base font-bold">Table setup</h3>
              <div className="space-y-2">
                {Object.entries(guide.game_setup.positions).map(
                  ([position, description]) => (
                    <div
                      key={position}
                      className="rounded-lg bg-white/[0.04] p-3"
                    >
                      <p className="text-xs font-bold capitalize text-purple-200">
                        {position.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        {description}
                      </p>
                    </div>
                  ),
                )}
              </div>
              <div className="mt-3 rounded-lg border border-amber-300/15 bg-amber-950/20 p-3">
                <h4 className="text-sm font-bold text-amber-100">Blinds &amp; antes</h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                  {guide.game_setup.blinds.purpose}
                </p>
                <p className="mt-2 text-xs text-zinc-400">
                  {guide.game_setup.blinds.example}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {guide.game_setup.ante}
                </p>
              </div>
              <div className="mt-3 rounded-lg bg-white/[0.04] p-3">
                <h4 className="text-xs font-bold text-purple-200">Card basics</h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {guide.equipment.cards}. {guide.equipment.suits_note}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  Ranks: {guide.equipment.card_rank_low_to_high.join(" · ")}.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {guide.equipment.ace_note}
                </p>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-end justify-between">
                <h3 className="text-base font-bold">Hand rankings</h3>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                  strongest → weakest
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-zinc-400">
                {guide.hand_rankings.description}
              </p>
              <ol className="space-y-2">
                {guide.hand_rankings.rankings.map((hand) => (
                  <li
                    key={hand.rank}
                    className="flex gap-3 rounded-lg border border-white/5 bg-white/[0.04] p-3"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-purple-400/15 text-xs font-black text-purple-200">
                      {hand.rank}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{hand.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                        {hand.description}
                      </p>
                      <p className="mt-1 font-mono text-xs text-amber-200/90">
                        {hand.example}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                <span className="font-semibold text-zinc-200">Ties: </span>
                {guide.hand_rankings.tie_breaking}
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-base font-bold">A hand, step by step</h3>
              <ol className="space-y-3">
                {guide.how_to_play.steps.map((step) => (
                  <li key={step.step} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-purple-300/30 text-xs font-bold text-purple-200">
                      {step.step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{step.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-3 rounded-lg bg-emerald-950/40 p-3 text-xs leading-relaxed text-emerald-100/80">
                {guide.how_to_play.winning_without_showdown}
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-base font-bold">Your actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(guide.player_actions).map(([action, detail]) => (
                  <div
                    key={action}
                    className="rounded-lg border border-white/5 bg-white/[0.04] p-3"
                  >
                    <h4 className="mb-1 text-sm font-bold capitalize text-purple-200">
                      {action.replace("_", " ")}
                    </h4>
                    <p className="text-xs leading-relaxed text-zinc-400">
                      {detail.description}
                    </p>
                    {"minimum_raise_rule" in detail && (
                      <p className="mt-2 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-zinc-500">
                        {detail.minimum_raise_rule}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-base font-bold">Betting &amp; side pots</h3>
              <div className="space-y-2">
                {guide.betting_structures.map((structure) => (
                  <div
                    key={structure.name}
                    className="rounded-lg bg-white/[0.04] p-3"
                  >
                    <p className="text-sm font-bold text-amber-200">
                      {structure.name}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {structure.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-amber-300/15 bg-amber-950/20 p-3">
                <p className="text-sm font-bold text-amber-100">Side pots</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                  {guide.side_pots.description}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {guide.side_pots.example}
                </p>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-base font-bold">Key terms</h3>
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {guide.key_terms.map(({ term, meaning }) => (
                  <div key={term} className="rounded-lg bg-white/[0.04] p-3">
                    <dt className="text-xs font-bold text-purple-200">{term}</dt>
                    <dd className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <h3 className="mb-3 text-base font-bold">Example hand</h3>
              <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
                {Object.entries(guide.example_hand).map(([street, description]) => (
                  <p key={street}>
                    <span className="font-bold capitalize text-purple-200">
                      {street.replace("_", " ")}:{" "}
                    </span>
                    {description}
                  </p>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-base font-bold">Beginner strategy</h3>
              <ul className="space-y-2">
                {guide.basic_strategy_tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-xs leading-relaxed text-zinc-300">
                    <span className="text-emerald-300">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-bold">Table etiquette</h3>
                <ul className="space-y-2">
                  {guide.etiquette.map((item) => (
                    <li key={item} className="text-xs leading-relaxed text-zinc-400">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold">Common mistakes</h3>
                <ul className="space-y-2">
                  {guide.common_mistakes.map((mistake) => (
                    <li key={mistake} className="text-xs leading-relaxed text-zinc-400">
                      • {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-base font-bold">Frequently asked</h3>
              <div className="space-y-2">
                {guide.faq.map(({ question, answer }) => (
                  <details
                    key={question}
                    className="group rounded-lg bg-white/[0.04] p-3"
                  >
                    <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                      <span className="flex items-center justify-between gap-3">
                        {question}
                        <span className="text-purple-300 transition group-open:rotate-45">
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-base font-bold">Other poker variants</h3>
              <div className="space-y-2">
                {guide.variants.map((variant) => (
                  <div
                    key={variant.name}
                    className="rounded-lg bg-white/[0.04] p-3"
                  >
                    <h4 className="text-sm font-bold text-purple-200">
                      {variant.name}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {variant.summary}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-xl border border-rose-300/15 bg-rose-950/20 p-4">
              <h3 className="mb-1 text-sm font-bold text-rose-200">
                Play responsibly
              </h3>
              <p className="text-xs leading-relaxed text-zinc-300">
                {guide.responsible_gaming.note}
              </p>
            </aside>
          </div>

          <footer className="border-t border-white/10 px-5 py-2 text-center text-[10px] text-zinc-500">
            Texas Hold&apos;em · Poker Joker Guide
          </footer>
        </section>
      )}
    </div>
  );
}