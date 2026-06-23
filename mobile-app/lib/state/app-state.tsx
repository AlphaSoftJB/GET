import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { ITEMS, Item } from "@/lib/design/data";

export interface HealthProfile {
  allergens: string[];
  conditions: string[];
  dietary: string[];
}

interface AppStateValue {
  items: Item[];
  addItem: (it: Omit<Item, "id">) => void;
  deleteItem: (id: number) => void;
  useItem: (id: number) => void;
  healthProfile: HealthProfile;
  setHealthProfile: (p: HealthProfile) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(ITEMS);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    allergens: ["Milk", "Tree Nuts"],
    conditions: ["Lactose Intolerance"],
    dietary: ["Gluten-Free"],
  });

  const addItem = useCallback((it: Omit<Item, "id">) => {
    setItems((prev) => [{ ...it, id: Date.now() }, ...prev]);
  }, []);
  const deleteItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);
  const useItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(
    () => ({ items, addItem, deleteItem, useItem, healthProfile, setHealthProfile }),
    [items, addItem, deleteItem, useItem, healthProfile]
  );
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
