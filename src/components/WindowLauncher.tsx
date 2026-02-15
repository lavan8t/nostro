"use client";

import { useAppContext } from "../state/AppContext";
import { makeWindow } from "../state/windowFactory";

export default function WindowLauncher() {
  const { state, dispatch } = useAppContext();

  const handleCreateWindow = () => {
    const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);
    const newZ = maxZ + 1;

    const newWindow = makeWindow({
      id: `wnd-notepad-${Date.now()}`,
      z: newZ,
      focused: true,
    });

    dispatch({ type: "ADD_WINDOW", payload: newWindow });
  };

  return (
    <button
      onClick={handleCreateWindow}
      className="fixed bottom-4 left-4 z-[9999] px-4 py-2 bg-blue-600 text-white font-medium rounded shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
    >
      New Window
    </button>
  );
}
