"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createFileSystem, OutputLine, TerminalTheme } from "./terminalTypes";
import { processCommand } from "./commandEngine";

interface BaseTerminalProps {
  theme: TerminalTheme;
  onTitleChange?: (title: string) => void;
  onClose?: () => void;
  onCrash?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function BaseTerminal({
  theme,
  onTitleChange,
  onClose,
  onCrash,
  className,
  style,
}: BaseTerminalProps) {
  const [cwd, setCwd] = useState("C:\\");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [crashing, setCrashing] = useState(false);
  const [dynBg, setDynBg] = useState("");
  const [dynFg, setDynFg] = useState("");
  const [lines, setLines] = useState<OutputLine[]>(() => {
    const base = Date.now();
    return theme.startupLines.map((text, i) => ({
      id: base + i,
      text,
      type: "system" as const,
    }));
  });

  const fs = useMemo(() => createFileSystem(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(
      () => setCursorVisible((v) => !v),
      530
    );
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on mount and click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const prompt = theme.promptPrefix(cwd);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (crashing) return; // locked during crash sequence
      if (e.key === "Enter") {
        const cmd = input.trim();

        // Echo the command line
        const cmdLine: OutputLine = {
          id: Date.now(),
          text: `${prompt}${input}`,
          type: "command",
        };

        if (cmd) {
          setHistory((prev) => [cmd, ...prev].slice(0, 100));
        }
        setHistoryIndex(-1);

        const result = processCommand(cmd, cwd, fs, theme.version);

        if (result.clear) {
          setLines([cmdLine].filter(() => false)); // clear all
        } else {
          setLines((prev) => [...prev, cmdLine, ...result.lines]);
        }

        if (result.crash && onCrash) {
          setCrashing(true);
          let count = 0;
          const total = 140; // ~12 seconds at 85ms
          const interval = setInterval(() => {
            setLines((prev) => [
              ...prev,
              { id: Date.now() + count, text: "bye", type: "output" as const },
            ]);
            count++;
            if (count >= total) {
              clearInterval(interval);
              setTimeout(() => onCrash(), 300);
            }
          }, 85);
          setInput("");
          return;
        }
        if (result.close) {
          onClose?.();
          return;
        }
        if (result.newCwd) setCwd(result.newCwd);
        if (result.newTitle && onTitleChange) onTitleChange(result.newTitle);
        if (result.newColors) {
          setDynBg(result.newColors.bg);
          setDynFg(result.newColors.fg);
        }

        setInput("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHistoryIndex((prev) => {
          const next = Math.min(prev + 1, history.length - 1);
          if (history[next] !== undefined) setInput(history[next]);
          return next;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHistoryIndex((prev) => {
          const next = Math.max(prev - 1, -1);
          setInput(next === -1 ? "" : history[next] ?? "");
          return next;
        });
      } else if (e.key === "Tab") {
        e.preventDefault();
        // Basic tab completion — list matching entries in cwd
        if (input) {
          const { getNode, resolvePath } = require("./commandEngine");
          const node = getNode(fs, cwd);
          if (node?.type === "dir") {
            const matches = Object.keys(node.children).filter((k) =>
              k.toLowerCase().startsWith(input.toLowerCase())
            );
            if (matches.length === 1) setInput(matches[0]);
          }
        }
      }
    },
    [input, cwd, fs, history, historyIndex, prompt, theme.version, onTitleChange]
  );

  const getLineColor = (type: OutputLine["type"]): string => {
    const fg = dynFg || theme.textColor;
    if (type === "error") {
      return theme.version === "win10" ? "#f14c4c" : fg;
    }
    return fg;
  };

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: dynBg || theme.bgColor,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
        color: dynFg || theme.textColor,
        overflowY: "auto",
        overflowX: "hidden",
        cursor: "text",
        boxSizing: "border-box",
        ...style,
      }}
      onClick={handleContainerClick}
      ref={outputRef}
    >
      {/* Inner content — min-height fills the window so bg covers empty space */}
      <div style={{ minHeight: "100%", padding: "4px 6px" }}>
        {/* Output lines */}
        {lines.map((line) => (
          <div
            key={line.id}
            style={{
              color: getLineColor(line.type),
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              lineHeight: "1.3",
              minHeight: "1.3em",
            }}
          >
            {line.text || "\u00A0"}
          </div>
        ))}

        {/* Input row — immediately after last output line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "pre",
            lineHeight: "1.3",
          }}
        >
          <span style={{ color: dynFg || theme.promptColor, flexShrink: 0 }}>
            {prompt}
          </span>

          <span style={{ position: "relative" }}>
            {input}
            <span
              style={{
                display: "inline-block",
                width: "0.6em",
                height: "1.1em",
                backgroundColor: cursorVisible ? theme.cursorColor : "transparent",
                verticalAlign: "text-bottom",
                marginLeft: "1px",
              }}
            />
          </span>

          {/* Hidden real input — captures keystrokes */}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              position: "absolute",
              opacity: 0,
              width: 1,
              height: 1,
              pointerEvents: "none",
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
