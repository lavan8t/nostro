"use client";

import React, { useReducer, useEffect } from "react";
import { AppContext, appReducer, initialState } from "../state/AppContext";
import { applyTheme } from "../themes/osThemes";

export function Providers({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync theme changes
  useEffect(() => {
    applyTheme(state.osIndex);
  }, [state.osIndex]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
