export interface ThemeTokens {
  // Core
  bg: string;
  wallpaper: string;
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
      taskbarBg: "linear-gradient(to bottom, #c0c0c0, #c0c0c0)",
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
      // Provided Gradient
      taskbarBg:
        "linear-gradient(rgb(31, 47, 134) 0px, rgb(49, 101, 196) 3%, rgb(54, 130, 229) 6%, rgb(68, 144, 230) 10%, rgb(56, 131, 229) 12%, rgb(43, 113, 224) 15%, rgb(38, 99, 218) 18%, rgb(35, 91, 214) 20%, rgb(34, 88, 213) 23%, rgb(33, 87, 214) 38%, rgb(36, 93, 219) 54%, rgb(37, 98, 223) 86%, rgb(36, 95, 220) 89%, rgb(33, 88, 212) 92%, rgb(29, 78, 192) 95%, rgb(25, 65, 165) 98%)",
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
      taskbarBg:
        "linear-gradient(to bottom, rgba(23, 23, 23, 0.85), rgba(23, 23, 23, 0.85))", // Glass-like shim
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
        taskbarBg: "linear-gradient(#e5e5e5, #e5e5e5)",
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
        taskbarBg: "linear-gradient(#101010, #101010)",
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
