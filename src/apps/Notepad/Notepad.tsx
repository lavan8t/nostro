"use client";

import React, { useRef, useEffect } from "react";
import { useAppContext } from "../state/AppContext";
import { MenuItem } from "../state/AppContext";

export const getNotepadMenus = (
  dispatch: any,
  winId: string,
  text: string,
): MenuItem[] => [
  {
    label: "File",
    action: () =>
      alert("File Menu: New, Open, Save, Save As, Page Setup, Print, Exit"),
  },
  {
    label: "Edit",
    action: () =>
      alert(
        "Edit Menu: Undo, Cut, Copy, Paste, Delete, Find, Find Next, Replace, Go To, Select All, Time/Date",
      ),
  },
  {
    label: "Search",
    action: () => alert("Search Menu: Find, Find Next"),
  },
  {
    label: "Help",
    action: () => alert("Help Menu: Help Topics, About Notepad"),
  },
];

export default function Notepad({ winId }: { winId: string }) {
  const { state, dispatch } = useAppContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: "SET_NOTEPAD_TEXT", payload: e.target.value });
  };

  return (
    <textarea
      ref={textareaRef}
      value={state.notepad.text}
      onChange={handleChange}
      className="w-full h-full resize-none outline-none p-1"
      style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "13px",
        lineHeight: "1.5",
        border: "none",
        whiteSpace: "pre-wrap",
        overflowY: "scroll",
      }}
      spellCheck={false}
    />
  );
}
