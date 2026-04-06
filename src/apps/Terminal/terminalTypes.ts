// ─── File system ────────────────────────────────────────────────────────────

export interface FSFile {
  type: "file";
  content: string;
  size: number;
  date: string;
}

export interface FSDir {
  type: "dir";
  children: Record<string, FSFile | FSDir>;
  date: string;
}

export type FSNode = FSFile | FSDir;

export const createFileSystem = (): FSDir => ({
  type: "dir",
  date: "01/01/2024",
  children: {
    "Users": {
      type: "dir",
      date: "01/01/2024",
      children: {
        "User": {
          type: "dir",
          date: "01/01/2024",
          children: {
            "Documents": {
              type: "dir",
              date: "01/01/2024",
              children: {
                "readme.txt": {
                  type: "file",
                  content: "Welcome to the Windows simulator!\r\nThis is a simulated file system.",
                  size: 62,
                  date: "01/01/2024",
                },
                "notes.txt": {
                  type: "file",
                  content: "These are some notes.\r\nLine 2.\r\nLine 3.",
                  size: 38,
                  date: "01/01/2024",
                },
              },
            },
            "Desktop": {
              type: "dir",
              date: "01/01/2024",
              children: {},
            },
            "Downloads": {
              type: "dir",
              date: "01/01/2024",
              children: {},
            },
          },
        },
      },
    },
    "Windows": {
      type: "dir",
      date: "01/01/2024",
      children: {
        "System32": {
          type: "dir",
          date: "01/01/2024",
          children: {
            "cmd.exe": {
              type: "file",
              content: "",
              size: 302592,
              date: "01/01/2024",
            },
          },
        },
      },
    },
    "Program Files": {
      type: "dir",
      date: "01/01/2024",
      children: {},
    },
  },
});

// ─── Theme interface ─────────────────────────────────────────────────────────

export interface TerminalTheme {
  version: "win98" | "winxp" | "win7" | "win10";
  fontFamily: string;
  fontSize: number;
  bgColor: string;
  textColor: string;
  promptColor: string;
  selectionBg: string;
  cursorColor: string;
  windowBg: string;
  titleBarBg: string;
  titleBarText: string;
  titleText: string;
  promptPrefix: (cwd: string) => string;
  versionString: string;
  startupLines: string[];
}

// ─── Command output line ─────────────────────────────────────────────────────

export interface OutputLine {
  id: number;
  text: string;
  type: "output" | "command" | "error" | "system";
}