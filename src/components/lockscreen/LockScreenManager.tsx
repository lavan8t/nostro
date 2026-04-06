"use client";

import React from "react";
import { useAppContext } from "../../state/AppContext";
import Win98Login from "./Win98Login";
import WinXPLogin from "./WinXPLogin";
import Win7Login from "./Win7Login";
import Win10Login from "./Win10Login";

export default function LockScreenManager({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const { state } = useAppContext();

  switch (state.osIndex) {
    case 0:
      return <Win98Login onUnlock={onUnlock} />;
    case 1:
      return <WinXPLogin onUnlock={onUnlock} />;
    case 2:
      return <Win7Login onUnlock={onUnlock} />;
    case 3:
      return <Win10Login onUnlock={onUnlock} />;
    default:
      return <Win10Login onUnlock={onUnlock} />;
  }
}
