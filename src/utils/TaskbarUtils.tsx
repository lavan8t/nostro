import React from "react";
import { Icons } from "../components/Icons";

export const getProgramId = (id: string): string => {
  const parts = id.split("-");
  if (parts.length >= 2) return parts[1].toLowerCase();
  return "default";
};

export const getProgramIcon = (programId: string) => {
  if (programId.includes("terminal") || programId.includes("cmd"))
    return <Icons.Terminal />;
  if (
    programId.includes("browser") ||
    programId.includes("chrome") ||
    programId.includes("web")
  )
    return <Icons.Browser />;
  if (
    programId.includes("notepad") ||
    programId.includes("editor") ||
    programId.includes("text")
  )
    return <Icons.Notepad />;
  if (programId.includes("paint") || programId.includes("draw"))
    return <Icons.Paint />;
  return <Icons.Default />;
};

export const getTaskbarButtonStyle = (
  osIndex: number,
  isActive: boolean,
): React.CSSProperties => {
  const win98Style: React.CSSProperties = {
    backgroundColor: "var(--ButtonFace)",
    color: "var(--ButtonText)",
    borderTop: isActive
      ? "1px solid var(--ButtonShadow)"
      : "1px solid var(--ButtonHilight)",
    borderLeft: isActive
      ? "1px solid var(--ButtonShadow)"
      : "1px solid var(--ButtonHilight)",
    borderRight: isActive
      ? "1px solid var(--ButtonHilight)"
      : "1px solid var(--ButtonDkShadow)",
    borderBottom: isActive
      ? "1px solid var(--ButtonHilight)"
      : "1px solid var(--ButtonDkShadow)",
    boxShadow: isActive
      ? "inset 1px 1px 0 0 var(--ButtonDkShadow)"
      : "inset -1px -1px 0 0 var(--ButtonShadow), inset 1px 1px 0 0 var(--ButtonLight)",
    backgroundImage: isActive
      ? "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')"
      : "none",
    opacity: 1,
    fontFamily: "var(--os-font)",
    fontSize: "11px",
    maxWidth: "160px",
    justifyContent: "flex-start",
  };

  const xpStyle: React.CSSProperties = {
    backgroundColor: isActive ? "rgba(20, 30, 80, 0.4)" : "rgba(0, 0, 0, 0)",
    color: "white",
    borderRadius: "2px",
    maxWidth: "160px",
    border: isActive ? "1px solid rgba(0,0,0,0.3)" : "1px solid transparent",
    boxShadow: isActive ? "inset 0 1px 2px rgba(0,0,0,0.2)" : "none",
    fontFamily: "Tahoma, sans-serif",
    fontSize: "11px",
    textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  };

  const modernStyle: React.CSSProperties = {
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
    borderBottom: isActive
      ? "2px solid var(--os-accent)"
      : "2px solid transparent",
    color: "var(--os-text)",
    borderRadius: "2px",
    maxWidth: "50px",
    justifyContent: "center",
  };

  if (osIndex === 0) return win98Style;
  if (osIndex === 1) return xpStyle;
  return modernStyle;
};
