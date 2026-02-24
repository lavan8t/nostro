# Nostro

A nostalgic Windows desktop emulator built with Next.js and React. Nostro recreates the look and feel of classic Windows operating systems (98, XP, 7, and 10) directly in the browser — complete with draggable windows, a taskbar, start menu, desktop icons, right-click context menus, and working applications.

## Features

- **Multi-OS Themes** — Switch between Windows 98, XP, 7, and Windows 10 (light & dark). Each theme applies authentic colour tokens, fonts, titlebars, and wallpapers.
- **Window Management** — Open, drag, resize, minimize, maximize, restore, and close windows using `react-rnd`.
- **Taskbar** — Live system clock, start button, and per-window taskbar buttons with minimize/restore toggling.
- **Start Menu** — OS-specific start menu layouts that open on clicking the start button.
- **Desktop Icons** — Draggable icons (My Computer, Recycle Bin). Supports auto-arrange and manual positioning.
- **Context Menus** — Right-click context menus with submenus on the desktop and inside applications.
- **Notepad** — A working text-editor application with File, Edit, Search, and Help menu bars.
- **Paint** — Drawing application framework (canvas + stroke state wired up).
- **Theme Crossfade** — Smooth GSAP-powered transition animations when switching OS themes.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | GSAP 3 |
| Window drag/resize | react-rnd |
| Package manager | Bun |

## Project Structure

```
src/
├── app/               # Next.js entry point (layout, page, global CSS, providers)
├── apps/              # Launchable in-OS applications
│   └── Notepad.tsx
├── components/        # Desktop UI components
│   ├── Desktop.tsx
│   ├── WindowFrame.tsx
│   ├── Taskbar.tsx
│   ├── StartMenu.tsx
│   ├── ContextMenu.tsx
│   ├── DesktopIcon.tsx
│   ├── ThemeCrossfade.tsx
│   ├── Icons.tsx
│   └── start-menu/    # OS-specific start menu layouts
├── state/             # Global state (React Context + useReducer)
│   ├── AppContext.tsx
│   └── windowFactory.ts
├── themes/            # OS theme token definitions
│   └── osThemes.ts
└── utils/             # Shared utilities
    └── TaskbarUtils.tsx
```

## Getting Started

Install dependencies and start the development server:

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You can also use npm, yarn, or pnpm:

```bash
npm install && npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start the Next.js development server |
| `bun run build` | Build for production |
| `bun run start` | Run the production build |
| `bun run lint` | Run ESLint |

## State Management

Global application state is managed with React Context and `useReducer` (`src/state/AppContext.tsx`). The state holds the current OS index, open windows, notepad/paint content, desktop icon positions, context menu state, and the recycle bin status. Dispatched actions cover window lifecycle (add, update, minimize, maximize, restore, remove), OS theme switching, and UI toggles.
