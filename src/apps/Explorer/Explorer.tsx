"use client";

import React from "react";
import { useAppContext } from "../../state/AppContext";
import Win98Explorer from "./win98/Win98Explorer";
import WinXPExplorer from "./winxp/WinXPExplorer";
import Win7Explorer from "./win7/Win7Explorer";

export { getExplorerMenus } from "./config";

export interface ExplorerProps {
  winId: string;
}

export default function Explorer({ winId }: ExplorerProps) {
  const { state } = useAppContext();

  if (state.osIndex === 0) return <Win98Explorer />;
  if (state.osIndex === 1) return <WinXPExplorer />;
  if (state.osIndex === 2) return <Win7Explorer />;

  return <Win7Explorer />;
}
