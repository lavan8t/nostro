"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { applyTheme } from "../themes/osThemes";

// --- DATA MODELS ---
export interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
}
export interface MenuItem {
  label: string;
  action?: () => void;
  disabled?: boolean;
  shortcut?: string;
  separator?: boolean;
  submenu?: MenuItem[];
}
export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  items: MenuItem[];
}
export interface WindowState {
  id: string;
  title?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  prevRect?: { x: number; y: number; width: number; height: number };
}
export interface DesktopIconState {
  id: string;
  x: number;
  y: number;
  gridX?: number;
  gridY?: number;
  type?: string;
  label?: string;
}

export type ShutdownState = "none" | "shutting_down" | "powered_off";

export interface AppState {
  osIndex: number;
  startMenuOpen: boolean;
  windows: WindowState[];
  notepad: { text: string };
  paint: { strokes: Stroke[] };
  contextMenu: ContextMenuState;
  icons: DesktopIconState[];
  recycleBinFilled: boolean;
  autoArrange: boolean;
  isBooted: boolean;
  isLoggedIn: boolean;
  bsod: boolean;
  shutdownState: ShutdownState; // NEW
}

// --- ACTIONS ---
export type Action =
  | { type: "SET_OS"; payload: number }
  | { type: "TOGGLE_START_MENU" }
  | { type: "CLOSE_START_MENU" }
  | { type: "ADD_WINDOW"; payload: WindowState }
  | { type: "UPDATE_WINDOW"; payload: Partial<WindowState> & { id: string } }
  | { type: "REMOVE_WINDOW"; payload: string }
  | { type: "MINIMIZE_WINDOW"; payload: string }
  | { type: "RESTORE_WINDOW"; payload: string }
  | { type: "MAXIMIZE_WINDOW"; payload: string }
  | { type: "UNMAXIMIZE_WINDOW"; payload: string }
  | { type: "SET_NOTEPAD_TEXT"; payload: string }
  | { type: "SET_PAINT_STROKES"; payload: Stroke[] }
  | {
      type: "OPEN_CONTEXT_MENU";
      payload: { x: number; y: number; items: MenuItem[] };
    }
  | { type: "CLOSE_CONTEXT_MENU" }
  | { type: "UPDATE_ICON_POS"; payload: { id: string; x: number; y: number } }
  | { type: "RENAME_ICON"; payload: { id: string; label: string } }
  | { type: "ALIGN_ICONS_TO_GRID" }
  | { type: "SET_AUTO_ARRANGE"; payload: boolean }
  | { type: "EMPTY_RECYCLE_BIN" }
  | { type: "ADD_ICON"; payload: DesktopIconState }
  | { type: "REMOVE_ICON"; payload: string }
  | { type: "BOOT_OS" }
  | { type: "LOG_IN" }
  | { type: "LOG_OUT" }
  | { type: "TRIGGER_BSOD" }
  | { type: "START_SHUTDOWN" }
  | { type: "FINISH_SHUTDOWN" }
  | { type: "POWER_ON" };

export const initialState: AppState = {
  osIndex: 3,
  startMenuOpen: false,
  windows: [],
  notepad: { text: "" },
  paint: { strokes: [] },
  isBooted: false,
  isLoggedIn: false,
  bsod: false,
  contextMenu: { isOpen: false, x: 0, y: 0, items: [] },
  icons: [
    { id: "computer", x: 10, y: 10 },
    { id: "recycle", x: 10, y: 100 },
    { id: "terminal", x: 10, y: 190, type: "terminal", label: "Command Prompt" },
    { id: "controlpanel", x: 10, y: 280, type: "controlpanel", label: "Control Panel" },
  ],
  recycleBinFilled: true,
  autoArrange: true,
  shutdownState: "none",
};

export const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_OS":
      return { ...state, osIndex: action.payload };
    case "TOGGLE_START_MENU":
      return {
        ...state,
        startMenuOpen: !state.startMenuOpen,
        contextMenu: { ...state.contextMenu, isOpen: false },
      };
    case "CLOSE_START_MENU":
      return { ...state, startMenuOpen: false };
    case "ADD_WINDOW":
      return { ...state, windows: [...state.windows, action.payload] };
    case "UPDATE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload } : w,
        ),
      };
    case "REMOVE_WINDOW":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.payload),
      };
    case "MINIMIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload
            ? {
                ...w,
                minimized: true,
                focused: false,
                prevRect: { x: w.x, y: w.y, width: w.width, height: w.height },
              }
            : w,
        ),
      };
    case "RESTORE_WINDOW": {
      const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload
            ? {
                ...w,
                ...(w.prevRect || {}),
                minimized: false,
                focused: true,
                z: maxZ + 1,
              }
            : w.focused
              ? { ...w, focused: false }
              : w,
        ),
      };
    }
    case "MAXIMIZE_WINDOW": {
      const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload
            ? {
                ...w,
                maximized: true,
                minimized: false,
                focused: true,
                z: maxZ + 1,
                prevRect: { x: w.x, y: w.y, width: w.width, height: w.height },
              }
            : w.focused
              ? { ...w, focused: false }
              : w,
        ),
      };
    }
    case "UNMAXIMIZE_WINDOW": {
      const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload
            ? {
                ...w,
                ...(w.prevRect || {}),
                maximized: false,
                focused: true,
                z: maxZ + 1,
              }
            : w.focused
              ? { ...w, focused: false }
              : w,
        ),
      };
    }
    case "SET_NOTEPAD_TEXT":
      return { ...state, notepad: { ...state.notepad, text: action.payload } };
    case "SET_PAINT_STROKES":
      return { ...state, paint: { ...state.paint, strokes: action.payload } };
    case "OPEN_CONTEXT_MENU":
      return {
        ...state,
        contextMenu: {
          isOpen: true,
          x: action.payload.x,
          y: action.payload.y,
          items: action.payload.items,
        },
      };
    case "CLOSE_CONTEXT_MENU":
      return { ...state, contextMenu: { ...state.contextMenu, isOpen: false } };
    case "UPDATE_ICON_POS":
      return {
        ...state,
        icons: state.icons.map((icon) =>
          icon.id === action.payload.id
            ? { ...icon, x: action.payload.x, y: action.payload.y }
            : icon,
        ),
      };
    case "RENAME_ICON":
      return {
        ...state,
        icons: state.icons.map((icon) =>
          icon.id === action.payload.id
            ? { ...icon, label: action.payload.label }
            : icon,
        ),
      };
    case "ALIGN_ICONS_TO_GRID": {
      const GRID_SIZE_X = 75;
      const GRID_SIZE_Y = 100;
      return {
        ...state,
        autoArrange: false,
        icons: state.icons.map((icon) => {
          const col = Math.max(0, Math.round((icon.x - 10) / GRID_SIZE_X));
          const row = Math.max(0, Math.round((icon.y - 10) / GRID_SIZE_Y));
          return {
            ...icon,
            x: 10 + col * GRID_SIZE_X,
            y: 10 + row * GRID_SIZE_Y,
          };
        }),
      };
    }
    case "SET_AUTO_ARRANGE":
      return { ...state, autoArrange: action.payload };
    case "EMPTY_RECYCLE_BIN":
      return { ...state, recycleBinFilled: false };
    case "ADD_ICON":
      return { ...state, icons: [...state.icons, action.payload] };
    case "REMOVE_ICON":
      return {
        ...state,
        icons: state.icons.filter((icon) => icon.id !== action.payload),
      };
    case "BOOT_OS":
      return { ...state, isBooted: true };
    case "LOG_IN":
      return { ...state, isLoggedIn: true };
    case "LOG_OUT": 
      return {
        ...state,
        isBooted: false,
        isLoggedIn: false,
        windows: [],
        startMenuOpen: false,
      };

    // --- NEW SHUTDOWN LOGIC ---
    case "START_SHUTDOWN":
      return {
        ...state,
        shutdownState: "shutting_down",
        isLoggedIn: false,
        startMenuOpen: false,
        windows: [],
        contextMenu: { ...state.contextMenu, isOpen: false },
      };
    case "FINISH_SHUTDOWN":
      return { ...state, shutdownState: "powered_off", isBooted: false };
    case "POWER_ON":
      return {
        ...state,
        shutdownState: "none",
        isBooted: false,
        isLoggedIn: false,
      };
    // --------------------------

    case "TRIGGER_BSOD":
      return { ...state, bsod: true, windows: [], startMenuOpen: false };

    default:
      return state;
  }
};

// --- CONTEXT ---
export interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}
export const AppContext = createContext<AppContextProps | undefined>(undefined);
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  useEffect(() => {
    applyTheme(state.osIndex);
  }, [state.osIndex]);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
