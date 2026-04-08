import React from "react";
import { Icons } from "../components/Icons";

export const getProgramId = (id: string): string => {
  const lowerId = id.toLowerCase();
  if (lowerId.includes("paint") || lowerId.includes("bitmap")) return "Paint";
  if (lowerId.includes("terminal") || lowerId.includes("cmd") || lowerId.includes("powershell")) return "Terminal";
  if (lowerId.includes("media") || lowerId.includes("audio")) return "Media Player";
  if (lowerId.includes("browser") || lowerId.includes("chrome") || lowerId.includes("web")) return "Browser";
  if (lowerId.includes("notepad") || lowerId.includes("editor") || lowerId.includes("text")) return "Notepad";
  if (lowerId.includes("explorer") || lowerId.includes("folder")) return "Explorer";
  if (lowerId.includes("code")) return "VS Code";
  if (lowerId.includes("calendar")) return "Calendar";

  const parts = id.split("-");
  if (parts[0] === "wnd" && parts.length >= 2) return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  return parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "App";
};

export const getProgramIcon = (programId: string, osIndex: number = 3) => {
  const id = programId.toLowerCase();
  const osDir = ["win98", "winxp", "win7", "win10"][osIndex] || "win10";

  if (id.includes("terminal") || id.includes("cmd")) {
    if (osIndex < 3) return <img src={`/assets/${osDir}/icons/command_prompt.ico`} className="w-full h-full object-contain drop-shadow-sm" alt="Terminal" />;
    return <Icons.Terminal />;
  }
  if (id.includes("browser") || id.includes("chrome") || id.includes("web"))
    return <Icons.Browser />;
  if (id.includes("notepad") || id.includes("editor") || id.includes("text")) {
    if (osIndex < 3) return <img src={`/assets/${osDir}/icons/${osIndex === 2 ? 'notepad.ico' : 'text.ico'}`} className="w-full h-full object-contain drop-shadow-sm" alt="Notepad" />;
    return <Icons.Notepad />;
  }
  if (id.includes("paint") || id.includes("draw") || id.includes("bitmap")) {
    if (osIndex < 3) return <img src={`/assets/${osDir}/icons/paint.ico`} className="w-full h-full object-contain drop-shadow-sm" alt="Paint" />;
    return <Icons.Paint />;
  }
  if (id.includes("media") || id.includes("audio"))
    return <img src={`/assets/${osDir}/icons/media.ico`} className="w-full h-full object-contain drop-shadow-sm" alt="Media Player" />;
  if (id.includes("explorer") || id.includes("folder") || id.includes("computer")) {
    if (osIndex < 3) return <img src={`/assets/${osDir}/icons/computer.ico`} className="w-full h-full object-contain drop-shadow-sm" alt="Explorer" />;
    return <Icons.Default />;
  }
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
