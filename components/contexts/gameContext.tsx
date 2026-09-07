"use client"

import { createContext, useContext, useState } from "react";

const GameContext = createContext<{
  isJoined: boolean;
  setIsJoined: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [isJoined, setIsJoined] = useState(false);

  return (
    <GameContext.Provider value={{ isJoined, setIsJoined }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}