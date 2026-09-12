"use client";
import { useEffect, useState } from "react";

type reactionDropdownProps = {
    reactions: string[]
    onSendReaction : () => void,
    onChangeReaction: (i: number) => void,
}

export default function ReactionDropdown({reactions, onChangeReaction, onSendReaction } : reactionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const handleSelect = (option: number) => {
    onSendReaction();
    setIsOpen(false);
    setIsCooldown(true)
    setTimeout(() => setIsCooldown(false), 8000)
  };

  return (
    <div className="flex flex-col items-center justify-end">
      <div className="relative inline-block">
        {/* Dropdown Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen && !isCooldown)}
          className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-white shadow-sm hover:bg-purple-700 ${!isCooldown ? "bg-purple-600" : "bg-red-600"}`}
        >
          {/* Simple Chevron Arrow */}
          <svg
            className={`h-5 w-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

        {/* 2. The Upward Menu (Triggered by isOpen state) */}
        {isOpen && !isCooldown && (
          <ul className="absolute bottom-full left-0 mb-2 rounded-lg border border-purple-600 bg-white/50 shadow-lg z-50 w-54 h-64 overflow-scroll">
            {reactions.map((reaction, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSelect(i)}
                  onMouseEnter={() => onChangeReaction(i)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/50 hover:text-purple-900"
                >
                  {reaction}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

