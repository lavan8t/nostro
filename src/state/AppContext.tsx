"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { applyTheme } from "../themes/osThemes";

// --------------------------------------------------
// DATA MODELS
// --------------------------------------------------

export interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
}

export interface WindowState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  prevRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AppState {
  osIndex: number;
  windows: WindowState[];
  notepad: { text: string };
  paint: { strokes: Stroke[] };
}

// --------------------------------------------------
// ACTIONS
// --------------------------------------------------

export type Action =
  | { type: "SET_OS"; payload: number }
  | { type: "ADD_WINDOW"; payload: WindowState }
  | { type: "UPDATE_WINDOW"; payload: Partial<WindowState> & { id: string } }
  | { type: "REMOVE_WINDOW"; payload: string }
  | { type: "MINIMIZE_WINDOW"; payload: string }
  | { type: "RESTORE_WINDOW"; payload: string }
  | { type: "MAXIMIZE_WINDOW"; payload: string }
  | { type: "UNMAXIMIZE_WINDOW"; payload: string }
  | { type: "SET_NOTEPAD_TEXT"; payload: string }
  | { type: "SET_PAINT_STROKES"; payload: Stroke[] };

// --------------------------------------------------
// REDUCER
// --------------------------------------------------

export const initialState: AppState = {
  osIndex: 3, // Defaulting to Windows 10
  windows: [],
  notepad: { text: "" },
  paint: { strokes: [] },
};

export const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_OS":
      return { ...state, osIndex: action.payload };

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
        windows: state.windows.map((w) => {
          if (w.id === action.payload) {
            return {
              ...w,
              minimized: true,
              focused: false,
              prevRect: {
                x: w.x,
                y: w.y,
                width: w.width,
                height: w.height,
              },
            };
          }
          return w;
        }),
      };

    case "RESTORE_WINDOW": {
      const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id === action.payload) {
            const targetRect = w.prevRect || {};
            return {
              ...w,
              ...targetRect,
              minimized: false,
              focused: true,
              z: maxZ + 1,
            };
          }
          if (w.focused) {
            return { ...w, focused: false };
          }
          return w;
        }),
      };
    }

    case "MAXIMIZE_WINDOW": {
      const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id === action.payload) {
            return {
              ...w,
              maximized: true,
              minimized: false,
              focused: true,
              z: maxZ + 1,
              prevRect: {
                x: w.x,
                y: w.y,
                width: w.width,
                height: w.height,
              },
            };
          }
          if (w.focused) {
            return { ...w, focused: false };
          }
          return w;
        }),
      };
    }

    case "UNMAXIMIZE_WINDOW": {
      const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id === action.payload) {
            const targetRect = w.prevRect || {};
            return {
              ...w,
              ...targetRect,
              maximized: false,
              focused: true,
              z: maxZ + 1,
            };
          }
          if (w.focused) {
            return { ...w, focused: false };
          }
          return w;
        }),
      };
    }

    case "SET_NOTEPAD_TEXT":
      return { ...state, notepad: { ...state.notepad, text: action.payload } };

    case "SET_PAINT_STROKES":
      return { ...state, paint: { ...state.paint, strokes: action.payload } };

    default:
      return state;
  }
};

// --------------------------------------------------
// CONTEXT
// --------------------------------------------------

export interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
