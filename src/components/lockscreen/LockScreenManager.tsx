"use client";

import React from "react";
import { useAppContext } from "../../state/AppContext";
import Win98Login from "./Win98Login";
import WinXPLogin from "./WinXPLogin";
import Win7Login from "./Win7Login";
import Win10Login from "./Win10Login";

export default function LockScreenManager() {
  const { state, dispatch } = useAppContext();

  
  const handleLogin = () => {
    dispatch({ type: "LOG_IN" });
  };

  switch (state.osIndex) {
    case 0:
      return <Win98Login onLogin={handleLogin} />;
    case 1:
      return <WinXPLogin onLogin={handleLogin} isLoading={false} />;
    case 2:
      return <Win7Login onLogin={handleLogin} isLoading={false} />;
    case 3:
      return <Win10Login onLogin={handleLogin} isLoading={false} />;
    default:
      return <Win10Login onLogin={handleLogin} isLoading={false} />;
  }
}