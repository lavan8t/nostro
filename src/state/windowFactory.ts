import { WindowState } from "./AppContext";

export const makeWindow = (
  overrides: Partial<WindowState> = {},
): WindowState => {
  const generateId = (): string => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `win_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  };

  const defaults: WindowState = {
    id: generateId(),
    x: 120,
    y: 120,
    width: 720,
    height: 480,
    z: 1,
    minimized: false,
    maximized: false,
    focused: false,
  };

  return { ...defaults, ...overrides };
};
