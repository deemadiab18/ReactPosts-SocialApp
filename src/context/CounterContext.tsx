/* eslint-disable react-refresh/only-export-components -- mirrors StitchHubCode CounterContext */
import { createContext, useState, type ReactNode } from "react";

type CounterContextValue = {
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
};

export const CounterContext = createContext<CounterContextValue | null>(null);

export default function CounterContextProvider({ children }: { children: ReactNode }) {
  const [counter, setCounter] = useState(0);
  return (
    <CounterContext.Provider value={{ counter, setCounter }}>
      {children}
    </CounterContext.Provider>
  );
}