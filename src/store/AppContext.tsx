import { createContext, useContext, useReducer, useEffect } from "react";
import { appReducer, initialState } from "./AppReducer";
import type { AppState } from "./types";

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<any>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    const data = localStorage.getItem("coworking-data");
    return data ? (JSON.parse(data) as AppState) : initialState;
  });
  useEffect(() => {
  const createNextDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    localStorage.setItem("coworking-timestamp", JSON.stringify(date));
    return date;
  }
  const savedDate = localStorage.getItem("coworking-timestamp");
  let nextDate: Date;
  if (!savedDate) {
    nextDate = createNextDate();
  } else {
    nextDate = new Date(JSON.parse(savedDate));
  }
  const currentDate = new Date();
  if (nextDate < currentDate) {
    localStorage.removeItem("coworking-data");
    nextDate = createNextDate();
  }
  const timeout = setTimeout(() => {
    localStorage.removeItem("coworking-data");
    createNextDate();
  }, nextDate.getTime() - currentDate.getTime());

  return () => clearTimeout(timeout);
}, []);


  useEffect(() => {
    localStorage.setItem("coworking-data", JSON.stringify(state));
  }, [state]);


  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
