export interface ThemeTokens {
  // Core
  bg: string;
  wallpaper: string; // New wallpaper token
  text: string;
  taskbarBg: string;
  accent: string;
  windowBorder: string;
  font: string;

  // System Colors (Win32 naming convention approx)
  buttonFace: string;
  buttonHilight: string;
  buttonShadow: string;
  buttonDkShadow: string;
  buttonLight: string;
  buttonText: string;

  // Titlebar
  activeTitle: string;
  activeTitleText: string;
  gradientActiveTitle: string;
  inactiveTitle: string;
  inactiveTitleText: string;
  gradientInactiveTitle: string;

  // Menu / Highlights
  menu: string;
  menuText: string;
  hilight: string;
  hilightText: string;
  grayText: string;
}

export interface SingleTheme {
  name: string;
  tokens: ThemeTokens;
}

export interface DualTheme {
  name: string;
  light: { tokens: ThemeTokens };
  dark: { tokens: ThemeTokens };
}

export type OSTheme = SingleTheme | DualTheme;

export const osThemes: OSTheme[] = [
  // 0 - Windows 98
  {
    name: "Windows 98",
    tokens: {
      bg: "#008080",
      wallpaper: "url('/assets/win98/wallpaper.avif')",
      text: "#000000",
      taskbarBg: "#c0c0c0",
      accent: "#000080",
      windowBorder: "#c0c0c0",
      font: '"Win98", sans-serif',

      buttonFace: "#c0c0c0",
      buttonHilight: "#ffffff",
      buttonShadow: "#808080",
      buttonDkShadow: "#000000",
      buttonLight: "#dfdfdf",
      buttonText: "#000000",

      activeTitle: "#000080",
      activeTitleText: "#ffffff",
      gradientActiveTitle: "#1084d0",

      inactiveTitle: "#808080",
      inactiveTitleText: "#c0c0c0",
      gradientInactiveTitle: "#b5b5b5",

      menu: "#c0c0c0",
      menuText: "#000000",
      hilight: "#000080",
      hilightText: "#ffffff",
      grayText: "#808080",
    },
  },
  // 1 - Windows XP
  {
    name: "Windows XP",
    tokens: {
      bg: "#293955",
      wallpaper: "url('/assets/winxp/wallpaper.avif')",
      text: "#000000",
      taskbarBg: "#245edb",
      accent: "#3d9e3d",
      windowBorder: "#0058ee",
      font: '"WinXP", "Tahoma", sans-serif',

      buttonFace: "#ece9d8",
      buttonHilight: "#ffffff",
      buttonShadow: "#aca899",
      buttonDkShadow: "#716f64",
      buttonLight: "#fbf9f4",
      buttonText: "#000000",

      activeTitle: "#0058ee",
      activeTitleText: "#ffffff",
      gradientActiveTitle: "#3b80f5",

      inactiveTitle: "#7695ce",
      inactiveTitleText: "#dce4f3",
      gradientInactiveTitle: "#8da3d3",

      menu: "#ffffff",
      menuText: "#000000",
      hilight: "#316ac5",
      hilightText: "#ffffff",
      grayText: "#aca899",
    },
  },
  // 2 - Windows 7
  {
    name: "Windows 7",
    tokens: {
      bg: "#1e1e1e",
      wallpaper: "url('/assets/win7/wallpaper.avif')",
      text: "#000000",
      taskbarBg: "rgba(23, 23, 23, 0.85)", // Glass-like
      accent: "#4593ce",
      windowBorder: "rgba(0, 0, 0, 0.4)",
      font: '"Win7", "Segoe UI", sans-serif',

      buttonFace: "#f0f0f0",
      buttonHilight: "#ffffff",
      buttonShadow: "#a0a0a0",
      buttonDkShadow: "#696969",
      buttonLight: "#e3e3e3",
      buttonText: "#000000",

      activeTitle: "#000000",
      activeTitleText: "#ffffff",
      gradientActiveTitle: "#000000",

      inactiveTitle: "#555555",
      inactiveTitleText: "#cccccc",
      gradientInactiveTitle: "#555555",

      menu: "#f0f0f0",
      menuText: "#000000",
      hilight: "#3399ff",
      hilightText: "#ffffff",
      grayText: "#808080",
    },
  },
  // 3 - Windows 10
  {
    name: "Windows 10",
    light: {
      tokens: {
        bg: "#f0f0f0",
        wallpaper: "url('/assets/win10/wallpaper.avif')",
        text: "#000000",
        taskbarBg: "#e5e5e5",
        accent: "#0078d7",
        windowBorder: "#d9d9d9",
        font: '"Win10", "Segoe UI", sans-serif',
        buttonFace: "#ffffff",
        buttonHilight: "#ffffff",
        buttonShadow: "#d9d9d9",
        buttonDkShadow: "#999999",
        buttonLight: "#f2f2f2",
        buttonText: "#000000",
        activeTitle: "#ffffff",
        activeTitleText: "#000000",
        gradientActiveTitle: "#ffffff",
        inactiveTitle: "#ffffff",
        inactiveTitleText: "#999999",
        gradientInactiveTitle: "#ffffff",
        menu: "#ffffff",
        menuText: "#000000",
        hilight: "#0078d7",
        hilightText: "#ffffff",
        grayText: "#999999",
      },
    },
    dark: {
      tokens: {
        bg: "#1f1f1f",
        wallpaper: "url('/assets/win10/wallpaper.avif')",
        text: "#ffffff",
        taskbarBg: "#101010",
        accent: "#0078d7",
        windowBorder: "#333333",
        font: '"Win10", "Segoe UI", sans-serif',
        buttonFace: "#2d2d2d",
        buttonHilight: "#444444",
        buttonShadow: "#1a1a1a",
        buttonDkShadow: "#000000",
        buttonLight: "#333333",
        buttonText: "#ffffff",
        activeTitle: "#2d2d2d",
        activeTitleText: "#ffffff",
        gradientActiveTitle: "#2d2d2d",
        inactiveTitle: "#2d2d2d",
        inactiveTitleText: "#808080",
        gradientInactiveTitle: "#2d2d2d",
        menu: "#2b2b2b",
        menuText: "#ffffff",
        hilight: "#0078d7",
        hilightText: "#ffffff",
        grayText: "#666666",
      },
    },
  },
  // 4 - Windows 11
  {
    name: "Windows 11",
    tokens: {
      bg: "#f3f3f3",
      wallpaper: "url('/assets/win11/wallpaper.avif')",
      text: "#1a1a1a",
      taskbarBg: "#ffffff",
      accent: "#0067c0",
      windowBorder: "#e5e5e5",
      font: '"Win11", "Segoe UI", sans-serif',
      buttonFace: "#ffffff",
      buttonHilight: "#f9f9f9",
      buttonShadow: "#e0e0e0",
      buttonDkShadow: "#d0d0d0",
      buttonLight: "#f9f9f9",
      buttonText: "#1a1a1a",
      activeTitle: "#ffffff",
      activeTitleText: "#1a1a1a",
      gradientActiveTitle: "#ffffff",
      inactiveTitle: "#ffffff",
      inactiveTitleText: "#8a8a8a",
      gradientInactiveTitle: "#ffffff",
      menu: "#ffffff",
      menuText: "#1a1a1a",
      hilight: "#0067c0",
      hilightText: "#ffffff",
      grayText: "#8a8a8a",
    },
  },
];

export const applyTheme = (osIndex: number): void => {
  if (typeof document === "undefined") return;

  const safeIndex = osThemes[osIndex] ? osIndex : 3;
  const theme = osThemes[safeIndex];

  let tokens: ThemeTokens;

  if ("light" in theme && "dark" in theme) {
    tokens = theme.dark.tokens;
  } else {
    tokens = (theme as SingleTheme).tokens;
  }

  const root = document.documentElement;
  // Core
  root.style.setProperty("--os-bg", tokens.bg);
  root.style.setProperty("--os-wallpaper", tokens.wallpaper);
  root.style.setProperty("--os-text", tokens.text);
  root.style.setProperty("--os-taskbar-bg", tokens.taskbarBg);
  root.style.setProperty("--os-accent", tokens.accent);
  root.style.setProperty("--os-window-border", tokens.windowBorder);
  root.style.setProperty("--os-font", tokens.font);

  // System Colors
  root.style.setProperty("--ButtonFace", tokens.buttonFace);
  root.style.setProperty("--ButtonHilight", tokens.buttonHilight);
  root.style.setProperty("--ButtonShadow", tokens.buttonShadow);
  root.style.setProperty("--ButtonDkShadow", tokens.buttonDkShadow);
  root.style.setProperty("--ButtonLight", tokens.buttonLight);
  root.style.setProperty("--ButtonText", tokens.buttonText);

  root.style.setProperty("--ActiveTitle", tokens.activeTitle);
  root.style.setProperty("--ActiveTitleText", tokens.activeTitleText);
  root.style.setProperty("--GradientActiveTitle", tokens.gradientActiveTitle);

  root.style.setProperty("--InactiveTitle", tokens.inactiveTitle);
  root.style.setProperty("--InactiveTitleText", tokens.inactiveTitleText);
  root.style.setProperty(
    "--GradientInactiveTitle",
    tokens.gradientInactiveTitle,
  );

  root.style.setProperty("--Menu", tokens.menu);
  root.style.setProperty("--MenuText", tokens.menuText);
  root.style.setProperty("--Hilight", tokens.hilight);
  root.style.setProperty("--HilightText", tokens.hilightText);
  root.style.setProperty("--GrayText", tokens.grayText);
};
