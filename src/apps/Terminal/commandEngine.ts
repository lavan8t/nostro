import {
  FSDir,
  FSFile,
  FSNode,
  OutputLine,
  createFileSystem,
} from "./terminalTypes";

let idCounter = 0;
const nextId = () => ++idCounter;

// ─── File system helpers ─────────────────────────────────────────────────────

export function resolvePath(root: FSDir, cwd: string, target: string): string {
  if (!target) return cwd;
  target = target.trim();

  // Absolute path
  if (target.match(/^[A-Za-z]:\\/)) return normalizePath(target);

  // Relative parts
  const parts = cwd.replace(/\\/g, "/").split("/").filter(Boolean);
  const segs = target.replace(/\\/g, "/").split("/");
  for (const seg of segs) {
    if (seg === "." || seg === "") continue;
    if (seg === "..") {
      if (parts.length > 1) parts.pop();
    } else {
      parts.push(seg);
    }
  }
  return normalizePath(parts.join("\\"));
}

function normalizePath(p: string): string {
  if (!p.includes(":\\")) return "C:\\";
  const [drive, ...rest] = p.split(":\\");
  const cleaned = rest
    .join(":\\")
    .split(/[\\/]+/)
    .filter(Boolean)
    .join("\\");
  return cleaned
    ? `${drive.toUpperCase()}:\\${cleaned}`
    : `${drive.toUpperCase()}:\\`;
}

export function getNode(root: FSDir, path: string): FSNode | null {
  const [, ...parts] = path.replace(/\\/g, "/").split("/");
  let cur: FSNode = root;

  for (const part of parts) {
    if (!part) continue;

    // 1. Check type as you already were
    if (cur.type !== "dir") return null;

    // 2. Explicitly cast to FSDir and type the children/child variables
    // This breaks the circular inference loop for the compiler
    const currentDir = cur as FSDir;
    const children: Record<string, FSNode> = currentDir.children;
    const child: FSNode | undefined = children[part];

    if (!child) {
      // case-insensitive fallback
      const key = Object.keys(children).find(
        (k) => k.toLowerCase() === part.toLowerCase(),
      );
      if (!key) return null;
      cur = children[key];
    } else {
      cur = child;
    }
  }
  return cur;
}

function cwdDisplay(cwd: string): string {
  return cwd;
}

// ─── Dir listing ─────────────────────────────────────────────────────────────

function formatDirListing(dir: FSDir, path: string): string[] {
  const lines: string[] = [];
  lines.push(` Directory of ${path}`);
  lines.push("");

  const entries = Object.entries(dir.children);
  let fileCount = 0;
  let dirCount = 0;
  let totalBytes = 0;

  for (const [name, node] of entries) {
    if (node.type === "dir") {
      lines.push(`${node.date}  12:00 AM    <DIR>          ${name}`);
      dirCount++;
    } else {
      const size = (node as FSFile).size.toLocaleString();
      lines.push(`${node.date}  12:00 AM    ${size.padStart(14)} ${name}`);
      fileCount++;
      totalBytes += (node as FSFile).size;
    }
  }

  lines.push(
    `               ${fileCount} File(s)    ${totalBytes.toLocaleString()} bytes`,
  );
  lines.push(`               ${dirCount} Dir(s)     10,737,418,240 bytes free`);
  return lines;
}

// ─── Command processor ───────────────────────────────────────────────────────

export interface CommandResult {
  lines: OutputLine[];
  newCwd?: string;
  clear?: boolean;
  newTitle?: string;
  newColors?: { bg: string; fg: string };
  close?: boolean;
  crash?: boolean;
}

export function processCommand(
  input: string,
  cwd: string,
  root: FSDir,
  version: "win98" | "winxp" | "win7" | "win10",
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [rawCmd, ...argParts] = trimmed.split(/\s+/);
  const cmd = rawCmd.toLowerCase();
  const args = argParts.join(" ");
  const lines: OutputLine[] = [];

  const out = (text: string, type: OutputLine["type"] = "output"): void => {
    lines.push({ id: nextId(), text, type });
  };
  const err = (text: string): void => out(text, "error");

  switch (cmd) {
    // ── cls / clear ────────────────────────────────────────────────────────
    case "cls":
    case "clear":
      return { lines: [], clear: true };

    // ── ver ───────────────────────────────────────────────────────────────
    case "ver": {
      const verStrings: Record<string, string> = {
        win98: "Microsoft Windows 98 [Version 4.10.1998]",
        winxp: "Microsoft Windows XP [Version 5.1.2600]",
        win7: "Microsoft Windows [Version 6.1.7601]",
        win10: "Microsoft Windows [Version 10.0.19045.3693]",
      };
      out("");
      out(verStrings[version] || "Unknown");
      out("");
      break;
    }

    // ── dir ───────────────────────────────────────────────────────────────
    case "dir": {
      const targetPath = args ? resolvePath(root, cwd, args) : cwd;
      const node = getNode(root, targetPath);
      if (!node) {
        err(`The system cannot find the path specified.`);
      } else if (node.type === "file") {
        err(`Invalid argument.`);
      } else {
        out(`\r\n Volume in drive C has no label.`);
        out(` Volume Serial Number is 2B4A-9F1E`);
        out("");
        for (const line of formatDirListing(node as FSDir, targetPath)) {
          out(line);
        }
      }
      break;
    }

    // ── cd / chdir ────────────────────────────────────────────────────────
    case "cd":
    case "chdir": {
      if (!args) {
        out(cwd);
        break;
      }
      if (args === "..") {
        const parts = cwd.split("\\");
        if (parts.length > 1) {
          parts.pop();
          const newCwd = parts.join("\\") || "C:\\";
          return { lines: [], newCwd };
        }
        break;
      }
      const newPath = resolvePath(root, cwd, args);
      const node = getNode(root, newPath);
      if (!node) {
        err(`The system cannot find the path specified.`);
      } else if (node.type === "file") {
        err(`The directory name is invalid.`);
      } else {
        return { lines: [], newCwd: newPath };
      }
      break;
    }

    // ── echo ──────────────────────────────────────────────────────────────
    case "echo": {
      if (
        !args ||
        args.toLowerCase() === "on" ||
        args.toLowerCase() === "off"
      ) {
        out(`ECHO is ${args.toLowerCase() === "off" ? "off" : "on"}.`);
      } else {
        out(args);
      }
      break;
    }

    // ── type ──────────────────────────────────────────────────────────────
    case "type": {
      if (!args) {
        err(`The syntax of the command is incorrect.`);
        break;
      }
      const filePath = resolvePath(root, cwd, args);
      const node = getNode(root, filePath);
      if (!node) {
        err(`The system cannot find the file specified.`);
      } else if (node.type === "dir") {
        err(`Access is denied.`);
      } else {
        const content = (node as FSFile).content;
        for (const line of content.split(/\r?\n/)) {
          out(line);
        }
      }
      break;
    }

    // ── date ──────────────────────────────────────────────────────────────
    case "date": {
      const now = new Date();
      out(
        `The current date is: ${now.toLocaleDateString("en-US", { weekday: "short", month: "2-digit", day: "2-digit", year: "numeric" })}`,
      );
      out(`Enter the new date: (mm-dd-yy)`);
      break;
    }

    // ── time ──────────────────────────────────────────────────────────────
    case "time": {
      const now = new Date();
      out(
        `The current time is: ${now.toLocaleTimeString("en-US", { hour12: false })}`,
      );
      break;
    }

    // ── title ─────────────────────────────────────────────────────────────
    case "title": {
      return { lines: [], newTitle: args || "" };
    }

    // ── color ────────────────────────────────────────────────────────────
    case "color": {
      const CMD_PALETTE: Record<string, string> = {
        "0": "#000000",
        "1": "#000080",
        "2": "#008000",
        "3": "#008080",
        "4": "#800000",
        "5": "#800080",
        "6": "#808000",
        "7": "#c0c0c0",
        "8": "#808080",
        "9": "#0000ff",
        a: "#00ff00",
        b: "#00ffff",
        c: "#ff0000",
        d: "#ff00ff",
        e: "#ffff00",
        f: "#ffffff",
      };
      if (!args) {
        // Reset to theme defaults
        return { lines: [], newColors: { bg: "", fg: "" } };
      }
      const code = args.trim().toLowerCase();
      if (code.length !== 2 || !CMD_PALETTE[code[0]] || !CMD_PALETTE[code[1]]) {
        err(`The specified color combination is invalid.`);
        break;
      }
      if (code[0] === code[1]) {
        err(`The specified color combination is invalid.`);
        break;
      }
      return {
        lines: [],
        newColors: { bg: CMD_PALETTE[code[0]], fg: CMD_PALETTE[code[1]] },
      };
    }

    // ── mkdir / md ────────────────────────────────────────────────────────
    case "mkdir":
    case "md": {
      if (!args) {
        err(`The syntax of the command is incorrect.`);
        break;
      }
      const parentPath = cwd;
      const parentNode = getNode(root, parentPath);
      if (parentNode?.type === "dir") {
        (parentNode as FSDir).children[args] = {
          type: "dir",
          date: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
          children: {},
        };
      }
      break;
    }

    // ── help ──────────────────────────────────────────────────────────────
    case "help":
    case "/?": {
      const cmds = [
        ["CLS", "Clears the screen."],
        ["CD", "Displays or changes the current directory."],
        ["DIR", "Displays a list of files and directories."],
        ["ECHO", "Displays messages or turns echo on/off."],
        ["TYPE", "Displays the contents of a text file."],
        ["MKDIR", "Creates a directory."],
        ["VER", "Displays the Windows version."],
        ["DATE", "Displays or sets the date."],
        ["TIME", "Displays or sets the time."],
        ["TITLE", "Sets the window title."],
        ["COLOR", "Sets console colors."],
        ["HELP", "Provides help information."],
        ["EXIT", "Quits the command interpreter."],
      ];
      out("For more information on a specific command, type HELP command-name");
      out("");
      for (const [name, desc] of cmds) {
        out(`${name.padEnd(10)} ${desc}`);
      }
      break;
    }

    // ── exit ──────────────────────────────────────────────────────────────
    case "exit": {
      return { lines: [], close: true };
    }

    // ── powershell aliases (win10) ────────────────────────────────────────
    case "ls":
    case "get-childitem": {
      if (version === "win10") {
        const node = getNode(root, cwd);
        if (node?.type === "dir") {
          out("");
          out(`    Directory: ${cwd}`);
          out("");
          out(`Mode                 LastWriteTime         Length Name`);
          out(`----                 -------------         ------ ----`);
          for (const [name, child] of Object.entries(
            (node as FSDir).children,
          )) {
            if (child.type === "dir") {
              out(
                `d----         ${child.date}  12:00 AM                ${name}`,
              );
            } else {
              out(
                `-a---         ${child.date}  12:00 AM          ${String((child as FSFile).size).padStart(6)} ${name}`,
              );
            }
          }
          out("");
        }
      } else {
        err(
          `'${rawCmd}' is not recognized as an internal or external command.`,
        );
      }
      break;
    }

    case "pwd":
    case "get-location": {
      if (version === "win10") {
        out("");
        out(`Path`);
        out(`----`);
        out(cwd);
        out("");
      } else {
        err(
          `'${rawCmd}' is not recognized as an internal or external command.`,
        );
      }
      break;
    }

    // ── nostro (easter egg) ───────────────────────────────────────────────
    case "nostro": {
      return { lines: [], crash: true };
    }

    // ── unknown ───────────────────────────────────────────────────────────
    default: {
      if (version === "win10") {
        err(
          `'${rawCmd}' is not recognized as the name of a cmdlet, function, script file, or operable program.`,
        );
        err(
          `Check the spelling of the name, or if a path was included, verify that the path is correct and try again.`,
        );
      } else {
        err(
          `'${rawCmd}' is not recognized as an internal or external command,`,
        );
        err(`operable program or batch file.`);
      }
      break;
    }
  }

  return { lines };
}

export { createFileSystem };
