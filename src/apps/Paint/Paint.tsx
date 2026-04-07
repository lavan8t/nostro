"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAppContext, MenuItem } from "../../state/AppContext";

export const getPaintMenus = (dispatch: any, winId: string): MenuItem[] => [];

export default function Paint({ winId }: { winId: string }) {
  const { state } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [activeColor, setActiveColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [activeTool, setActiveTool] = useState("pencil");
  const [brushSize, setBrushSize] = useState(2);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [zoom, setZoom] = useState(100);
  const [canvasDims, setCanvasDims] = useState({ w: 0, h: 0 });

  const osIndex = state.osIndex; // 0: 98, 1: XP, 2: 7, 3: 10/11
  const isWin98 = osIndex === 0;
  const isWinXP = osIndex === 1;
  const isWin7 = osIndex === 2;
  const isWin10 = osIndex === 3;

  // ─── Palettes ──────────────────────────────────────────────────────────────

  // Win 98: 28-color classic palette (2 rows × 14)
  const palette98: string[] = [
    "#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080","#808040","#004040","#0080ff","#004080","#8000ff","#804000",
    "#ffffff","#c0c0c0","#ff0000","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff","#ffff80","#00ff80","#80ffff","#8080ff","#ff0080","#ff8040",
  ];

  // WinXP: same shape, slightly brighter
  const paletteXP: string[] = palette98;

  // Win 7 / 10: exact 30-color ribbon palette
  const palette7: string[] = [
    "#000000","#7f7f7f","#880015","#ed1c24","#ff7f27","#fff200","#22b14c","#00a2e8","#3f48cc","#a349a4",
    "#ffffff","#c3c3c3","#b97a57","#ffaec9","#ffc90e","#efe4b0","#b5e61d","#99d9ea","#7092be","#c8bfe7",
    "#f2f2f2","#e6e6e6","#cccccc","#b3b3b3","#999999","#808080","#666666","#4d4d4d","#333333","#1a1a1a",
  ];

  const activePalette = isWin98 ? palette98 : isWinXP ? paletteXP : palette7;

  // ─── Tool definitions ───────────────────────────────────────────────────────

  // Win 98/XP sidebar tools (icon chars that look like the old ones)
  const tools98 = [
    { id: "select-rect", label: "⬚", title: "Free-Form Select" },
    { id: "select-free", label: "⬡", title: "Select" },
    { id: "eraser",      label: "◻", title: "Eraser/Color Eraser" },
    { id: "fill",        label: "🪣", title: "Fill With Color" },
    { id: "picker",      label: "💉", title: "Pick Color" },
    { id: "zoom",        label: "🔍", title: "Magnifier" },
    { id: "pencil",      label: "✏️", title: "Pencil" },
    { id: "brush",       label: "🖌", title: "Brush" },
    { id: "airbrush",    label: "💨", title: "Airbrush" },
    { id: "text",        label: "A",  title: "Text" },
    { id: "line",        label: "╲",  title: "Line" },
    { id: "curve",       label: "∿",  title: "Curve" },
    { id: "rect",        label: "▭",  title: "Rectangle" },
    { id: "polygon",     label: "⬠",  title: "Polygon" },
    { id: "ellipse",     label: "⬭",  title: "Ellipse" },
    { id: "round-rect",  label: "▢",  title: "Rounded Rectangle" },
  ];

  // Win 7 ribbon tools
  const tools7 = [
    { id: "pencil",  icon: "✏️", label: "Pencil" },
    { id: "fill",    icon: "🪣", label: "Fill" },
    { id: "text",    icon: "A",  label: "Text" },
    { id: "eraser",  icon: "◻",  label: "Eraser" },
    { id: "picker",  icon: "💉", label: "Picker" },
    { id: "zoom",    icon: "🔍", label: "Zoom" },
  ];

  const brushSizes = [1, 3, 5, 8];

  // Win 7 shapes grid
  const shapes7 = ["╲","∿","◯","▭","△","⇨","⭐","💬","♡","⚡","⬠","⬣","⇧","⇩","➕"];

  // ─── Canvas logic ────────────────────────────────────────────────────────────

  const saveState = useCallback(() => {
    if (!canvasRef.current) return;
    const dataURL = canvasRef.current.toDataURL();
    setHistory(prev => {
      const newH = prev.slice(0, historyStep + 1);
      newH.push(dataURL);
      setHistoryStep(newH.length - 1);
      return newH;
    });
  }, [historyStep]);

  const undo = useCallback(() => {
    setHistoryStep(prev => Math.max(prev - 1, 0));
  }, []);

  const redo = useCallback(() => {
    setHistoryStep(prev => Math.min(prev + 1, history.length - 1));
  }, [history.length]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, [saveState]);

  useEffect(() => {
    if (historyStep >= 0 && history[historyStep]) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = new Image();
      img.src = history[historyStep];
      img.onload = () => {
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  }, [historyStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") undo();
      if (e.ctrlKey && e.key === "y") redo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const resizeCanvas = () => {
      const ctx = canvas.getContext("2d");
      let imgData: ImageData | null = null;
      if (canvas.width > 0 && canvas.height > 0 && ctx)
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      setCanvasDims({ w: canvas.width, h: canvas.height });
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (imgData) ctx.putImageData(imgData, 0, 0);
      }
      if (history.length === 0) saveState();
    };
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(container);
    return () => ro.disconnect();
  }, [osIndex]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  });

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!["pencil", "eraser", "brush"].includes(activeTool)) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = activeTool === "eraser" ? "#ffffff" : activeColor;
    ctx.lineWidth = activeTool === "eraser" ? brushSize * 4 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) { setIsDrawing(false); saveState(); }
  };

  const getCursor = () => {
    if (activeTool === "zoom") return "zoom-in";
    if (activeTool === "fill") return "cell";
    if (activeTool === "picker") return "crosshair";
    if (activeTool === "eraser") return "cell";
    return "crosshair";
  };

  // ─── Shared helpers ──────────────────────────────────────────────────────────

  // Win 98 inset/raised border helpers
  const inset98 = "border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white";
  const raised98 = "border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]";
  const pressed98 = "border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white";

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  // ════════════════════════════════════════
  //  WINDOWS 98
  // ════════════════════════════════════════
  if (isWin98) return (
    <div className="w-full h-full flex flex-col select-none overflow-hidden bg-[#c0c0c0] text-[11px] font-['Arial']" style={{ fontFamily: "Arial, sans-serif" }}>

      {/* Menu bar */}
      <div className="h-[22px] flex items-center px-1 gap-1 bg-[#c0c0c0] flex-shrink-0 border-b border-[#808080]">
        {["File","Edit","View","Image","Colors","Help"].map(m => (
          <button key={m} className="px-2 py-0.5 hover:bg-[#000080] hover:text-white text-[11px]">{m}</button>
        ))}
      </div>

      {/* Toolbar row */}
      <div className={`flex items-center h-[28px] flex-shrink-0 bg-[#c0c0c0] px-1 gap-1 border-b border-[#808080]`}>
        {/* New, Open, Save */}
        {[
          { label: "📄", title: "New" },
          { label: "📂", title: "Open" },
          { label: "💾", title: "Save" },
        ].map(btn => (
          <button key={btn.title} title={btn.title} className={`w-6 h-6 flex items-center justify-center text-sm ${raised98} active:${pressed98} bg-[#c0c0c0]`}>{btn.label}</button>
        ))}
        <div className="w-px h-5 bg-[#808080] mx-1"></div>
        <button onClick={undo} title="Undo" className={`w-6 h-6 flex items-center justify-center text-sm ${raised98} bg-[#c0c0c0]`}>↩</button>
        <button title="Redo" className={`w-6 h-6 flex items-center justify-center text-sm ${raised98} bg-[#c0c0c0] opacity-40`}>↪</button>
      </div>

      {/* Main area: left toolbox + canvas + right (none in 98) */}
      <div className="flex flex-grow overflow-hidden">

        {/* LEFT TOOLBOX */}
        <div className={`w-[54px] flex-shrink-0 flex flex-col items-center py-1 gap-[2px] bg-[#c0c0c0] border-r-2 border-r-[#808080]`}>
          {/* Tool grid 2-col */}
          <div className="grid grid-cols-2 gap-[2px] w-full px-[3px]">
            {tools98.map(tool => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  title={tool.title}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-[22px] h-[22px] flex items-center justify-center text-[13px] leading-none
                    ${isActive
                      ? `bg-[#c0c0c0] ${inset98}`
                      : `bg-[#c0c0c0] ${raised98} active:${inset98}`
                    }`}
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  {tool.label}
                </button>
              );
            })}
          </div>

          {/* Brush size selector */}
          <div className={`w-[44px] mt-2 flex flex-col items-center gap-[2px] p-1 ${inset98}`}>
            {brushSizes.map(s => (
              <div
                key={s}
                onClick={() => setBrushSize(s)}
                className={`w-full flex items-center justify-center cursor-pointer h-4 ${brushSize === s ? "bg-[#000080]" : "hover:bg-[#aaaaaa]"}`}
              >
                <div
                  className={`rounded-full ${brushSize === s ? "bg-white" : "bg-black"}`}
                  style={{ width: "85%", height: `${Math.max(1, s - 0.5)}px` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CANVAS AREA */}
        <div
          ref={containerRef}
          className={`flex-grow relative overflow-auto ${inset98} m-1 bg-[#808080]`}
        >
          <canvas
            ref={canvasRef}
            className="absolute top-2 left-2 bg-white"
            style={{ cursor: getCursor(), display: "block", boxShadow: "2px 2px 0 #000" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      {/* BOTTOM PALETTE */}
      <div className="flex-shrink-0 h-[36px] bg-[#c0c0c0] border-t border-[#808080] flex items-center px-2 gap-2">
        {/* Active color preview */}
        <div className={`w-8 h-7 relative flex-shrink-0 ${inset98}`}>
          <div className="absolute bottom-1 right-1 w-5 h-4 bg-white border border-[#808080]" />
          <div className="absolute top-1 left-1 w-5 h-4 border border-[#808080]" style={{ backgroundColor: activeColor }} />
        </div>
        {/* Palette grid */}
        <div className={`flex flex-wrap ${inset98} p-[2px]`} style={{ width: `${palette98.length / 2 * 14 + 4}px` }}>
          {palette98.map((c, i) => (
            <div
              key={i}
              onClick={() => setActiveColor(c)}
              title={c}
              className={`cursor-pointer border hover:scale-110 ${activeColor === c ? "border-white" : "border-[#808080]"}`}
              style={{ width: 14, height: 14, backgroundColor: c, flexShrink: 0 }}
            />
          ))}
        </div>
        {/* Status */}
        <div className="ml-auto text-[10px] text-[#000] flex items-center gap-4">
          <span>{canvasDims.w} × {canvasDims.h}</span>
          <span>For Help, click Help Topics on the Help Menu.</span>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════
  //  WINDOWS XP
  // ════════════════════════════════════════
  if (isWinXP) return (
    <div className="w-full h-full flex flex-col select-none overflow-hidden text-[11px]" style={{ background: "#ece9d8", fontFamily: "Tahoma, sans-serif" }}>

      {/* Menu bar */}
      <div className="h-[22px] flex items-center px-1 gap-0 flex-shrink-0 border-b border-[#aca899]" style={{ background: "#ece9d8" }}>
        {["File","Edit","View","Image","Colors","Help"].map(m => (
          <button key={m} className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white text-[11px] rounded-sm">{m}</button>
        ))}
      </div>

      {/* XP Toolbar */}
      <div className="h-[28px] flex items-center px-1 gap-1 flex-shrink-0 border-b border-[#aca899]" style={{ background: "#ece9d8" }}>
        {[
          { label: "📄", title: "New" },
          { label: "📂", title: "Open" },
          { label: "💾", title: "Save" },
        ].map(btn => (
          <button key={btn.title} title={btn.title} className="w-6 h-6 flex items-center justify-center text-sm border border-transparent hover:border-[#316ac5] hover:bg-[#d6e2f8] rounded-sm active:bg-[#c1d2ee]">{btn.label}</button>
        ))}
        <div className="w-px h-5 bg-[#aca899] mx-1" />
        <button onClick={undo} className="w-6 h-6 flex items-center justify-center text-sm border border-transparent hover:border-[#316ac5] hover:bg-[#d6e2f8] rounded-sm">↩</button>
        <button className="w-6 h-6 flex items-center justify-center text-sm border border-transparent hover:border-[#316ac5] hover:bg-[#d6e2f8] rounded-sm opacity-40">↪</button>
      </div>

      <div className="flex flex-grow overflow-hidden">

        {/* XP LEFT TOOLBOX */}
        <div className="w-[56px] flex-shrink-0 flex flex-col items-center py-1 gap-[2px] border-r border-[#aca899]" style={{ background: "#ece9d8" }}>
          <div className="grid grid-cols-2 gap-[2px] w-full px-[3px]">
            {tools98.map(tool => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  title={tool.title}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-[22px] h-[22px] flex items-center justify-center text-[13px] leading-none rounded-sm border transition-colors
                    ${isActive
                      ? "bg-[#c1d2ee] border-[#316ac5]"
                      : "bg-transparent border-transparent hover:bg-[#d6e2f8] hover:border-[#316ac5]"
                    }`}
                >
                  {tool.label}
                </button>
              );
            })}
          </div>

          {/* Brush sizes */}
          <div className="w-[44px] mt-2 flex flex-col items-center gap-[2px] p-1 border border-[#aca899] rounded-sm bg-white">
            {brushSizes.map(s => (
              <div
                key={s}
                onClick={() => setBrushSize(s)}
                className={`w-full flex items-center justify-center cursor-pointer h-4 rounded-sm ${brushSize === s ? "bg-[#316ac5]" : "hover:bg-[#d6e2f8]"}`}
              >
                <div
                  className={`rounded-full ${brushSize === s ? "bg-white" : "bg-black"}`}
                  style={{ width: "85%", height: `${Math.max(1, s - 0.5)}px` }}
                />
              </div>
            ))}
          </div>

          <div className="w-full px-1 mt-2 flex flex-col gap-1">
            <button onClick={undo} className="w-full text-[10px] py-0.5 border border-[#aca899] rounded-sm hover:bg-[#d6e2f8] hover:border-[#316ac5]">Undo</button>
            <button onClick={clearCanvas} className="w-full text-[10px] py-0.5 border border-[#aca899] rounded-sm hover:bg-[#d6e2f8] hover:border-[#316ac5]">Clear</button>
          </div>
        </div>

        {/* CANVAS */}
        <div
          ref={containerRef}
          className="flex-grow relative overflow-auto m-1"
          style={{ background: "#808080", border: "2px inset #808080" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute top-2 left-2 bg-white"
            style={{ cursor: getCursor(), display: "block", boxShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      {/* XP BOTTOM PALETTE */}
      <div className="flex-shrink-0 h-[36px] flex items-center px-2 gap-2 border-t border-[#aca899]" style={{ background: "#ece9d8" }}>
        {/* Active/bg color preview */}
        <div className="w-8 h-7 relative flex-shrink-0 border border-[#aca899] rounded-sm bg-white">
          <div className="absolute bottom-0.5 right-0.5 w-5 h-4 bg-white border border-[#aca899]" />
          <div className="absolute top-0.5 left-0.5 w-5 h-4 border border-[#aca899]" style={{ backgroundColor: activeColor }} />
        </div>
        <div className="flex flex-wrap border border-[#aca899] rounded-sm p-[1px] bg-white" style={{ width: `${paletteXP.length / 2 * 14 + 4}px` }}>
          {paletteXP.map((c, i) => (
            <div
              key={i}
              onClick={() => setActiveColor(c)}
              className={`cursor-pointer border hover:scale-110 ${activeColor === c ? "border-[#316ac5]" : "border-[#aca899]"}`}
              style={{ width: 14, height: 14, backgroundColor: c, flexShrink: 0 }}
            />
          ))}
        </div>
        <span className="ml-auto text-[10px] text-[#555]">{canvasDims.w} × {canvasDims.h}px</span>
      </div>
    </div>
  );

  // ════════════════════════════════════════
  //  WINDOWS 7 (Aero Ribbon)
  // ════════════════════════════════════════
  if (isWin7) return (
    <div className="w-full h-full flex flex-col select-none overflow-hidden text-[11px]" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", background: "#c5d8f1" }}>

      {/* Quick Access Toolbar */}
      <div className="h-7 flex items-center px-2 gap-1 flex-none" style={{ background: "linear-gradient(to bottom, #dbe8f5, #c1d7f0)" }}>
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-none shadow" style={{ background: "linear-gradient(to bottom, #3971ab, #193e6d)", border: "1px solid #112d50" }}>
          <span className="text-white text-[8px]">🎨</span>
        </div>
        <button onClick={saveState} title="Save" className="text-[12px] opacity-80 hover:opacity-100 hover:bg-white/40 rounded px-1 border border-transparent hover:border-[#91b5e1]">💾</button>
        <button onClick={undo}      title="Undo" className="text-[12px] opacity-80 hover:opacity-100 hover:bg-white/40 rounded px-1 border border-transparent hover:border-[#91b5e1]">↩️</button>
        <button onClick={redo}      title="Redo" className="text-[12px] opacity-40 rounded px-1 border border-transparent">↪️</button>
        <span className="text-[8px] opacity-70 cursor-pointer">▼</span>
      </div>

      {/* Tab row */}
      <div className="flex items-end px-1 h-[25px] flex-none" style={{ background: "linear-gradient(to bottom, #d1e2f3, #bfd5ec)" }}>
        {/* File button */}
        <div className="flex items-center gap-1 px-3 py-[2px] rounded-t-sm ml-1 cursor-pointer flex-none" style={{ background: "linear-gradient(to bottom, #2b619d, #144073)", border: "1px solid #0f2c52", borderBottom: "none" }}>
          <span className="text-[10px] text-white leading-none">📄</span>
          <span className="text-[7px] text-white">▼</span>
        </div>
        {/* Home tab (active) */}
        <div className="px-4 py-[4px] rounded-t text-[11px] font-bold relative z-10 -mb-[1px] ml-1" style={{ background: "linear-gradient(to bottom, #fcfefe, #e8f1fc)", border: "1px solid #8ba8c9", borderBottom: "1px solid #e8f1fc", color: "#1e395b" }}>
          Home
        </div>
        <div className="px-4 py-[3px] text-[11px] cursor-pointer ml-1 hover:bg-white/30 rounded-t-sm" style={{ color: "#1e395b" }}>View</div>
      </div>

      {/* Ribbon */}
      <div className="w-full overflow-x-auto border-y flex-none" style={{ background: "linear-gradient(to bottom, #f2f7fc, #dae9f6)", borderColor: "#8ba8c9" }}>
        <div className="flex items-start h-[92px] px-1 py-1 min-w-max gap-0 flex-nowrap">

          {/* ── Clipboard ── */}
          <RibbonGroup7 label="Clipboard">
            <div className="flex items-start h-[58px]">
              <Ribbon7BigBtn label="Paste" icon="📋" dropdown />
              <div className="flex flex-col justify-start h-[58px] ml-1 gap-[1px]">
                <Ribbon7SmallBtn icon="✂️" label="Cut" />
                <Ribbon7SmallBtn icon="📄" label="Copy" />
              </div>
            </div>
          </RibbonGroup7>

          {/* ── Image ── */}
          <RibbonGroup7 label="Image">
            <div className="flex items-start h-[58px]">
              <Ribbon7BigBtn label="Select" icon="⬚" dropdown />
              <div className="flex flex-col justify-start h-[58px] ml-1 gap-[1px]">
                <Ribbon7SmallBtn icon="◩" label="Crop" />
                <Ribbon7SmallBtn icon="⤡" label="Resize" />
                <Ribbon7SmallBtn icon="↻" label="Rotate" dropdown />
              </div>
            </div>
          </RibbonGroup7>

          {/* ── Tools ── */}
          <RibbonGroup7 label="Tools">
            <div className="grid grid-cols-3 gap-[2px] mt-1 w-[72px]">
              {tools7.map(tool => {
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    title={tool.label}
                    className={`w-[22px] h-[22px] flex items-center justify-center rounded text-[13px] border transition-colors
                      ${isActive
                        ? "border-[#f2cb1d] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]"
                        : "border-transparent hover:border-[#f2cb1d]"
                      }`}
                    style={isActive ? { background: "linear-gradient(to bottom, #fdeeb3, #fce07e)" } : undefined}
                  >
                    {tool.icon}
                  </button>
                );
              })}
            </div>
          </RibbonGroup7>

          {/* ── Brushes ── */}
          <RibbonGroup7 label="Brushes">
            <Ribbon7BigBtn label="Brushes" icon="🖌️" dropdown />
          </RibbonGroup7>

          {/* ── Shapes ── */}
          <RibbonGroup7 label="Shapes">
            <div className="flex items-start h-[58px]">
              <div className="w-[110px] h-[52px] bg-white border border-[#a0b0c0] shadow-inner grid grid-cols-5 p-[2px] overflow-hidden flex-none">
                {shapes7.map((s, i) => (
                  <div key={i} className="flex items-center justify-center text-[10px] hover:bg-[#e5f3fb] hover:border hover:border-[#70c0e7] cursor-pointer" style={{ color: "#3b6290" }}>{s}</div>
                ))}
              </div>
              <div className="flex flex-col h-[52px] w-[14px] flex-none">
                <button className="flex-1 border border-[#a0b0c0] bg-[#f0f4f9] text-[6px] hover:bg-[#dce6f2] flex items-center justify-center -ml-[1px]">▲</button>
                <button className="flex-1 border-x border-[#a0b0c0] bg-[#f0f4f9] text-[6px] hover:bg-[#dce6f2] flex items-center justify-center -ml-[1px]">▼</button>
                <button className="flex-1 border border-[#a0b0c0] bg-[#f0f4f9] text-[8px] hover:bg-[#dce6f2] flex items-center justify-center -ml-[1px]">≡</button>
              </div>
              <div className="flex flex-col justify-start h-full ml-2 gap-[1px] flex-none">
                <Ribbon7SmallBtn icon="✏️" label="Outline" dropdown />
                <Ribbon7SmallBtn icon="🪣" label="Fill" dropdown />
              </div>
            </div>
          </RibbonGroup7>

          {/* ── Size ── */}
          <RibbonGroup7 label="Size">
            <div className="relative group w-[50px] h-[58px]">
              <button className="flex flex-col items-center justify-center w-full h-full rounded border border-transparent hover:border-[#f2cb1d] transition-colors" style={{ background: "none" }}>
                <div className="flex flex-col gap-[3px] mb-2 w-[24px]">
                  {[1,2,3,4].map(n => <div key={n} className="w-full bg-[#1e395b]" style={{ height: `${n}px` }} />)}
                </div>
                <span className="text-[10px] text-[#1e395b]">Size <span className="text-[8px]">▼</span></span>
              </button>
              {/* Dropdown on hover */}
              <div className="hidden group-hover:flex flex-col absolute top-full left-0 bg-white border border-[#a0b0c0] shadow-md z-50 w-[80px] py-1">
                {brushSizes.map(s => (
                  <div key={s} onClick={() => setBrushSize(s)} className={`w-full h-6 flex items-center justify-center cursor-pointer border border-transparent hover:bg-[#e5f3fb] hover:border-[#70c0e7] ${brushSize === s ? "bg-[#c4e5f6]" : ""}`}>
                    <div className="bg-black rounded-full" style={{ width: "80%", height: `${s}px` }} />
                  </div>
                ))}
              </div>
            </div>
          </RibbonGroup7>

          {/* ── Colors ── */}
          <RibbonGroup7 label="Colors">
            <div className="flex items-start gap-1 h-[58px] mt-1">
              {/* Color 1 & 2 */}
              <div className="flex gap-1 flex-none">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded border border-[#f2cb1d] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]" style={{ background: "linear-gradient(to bottom, #fdeeb3, #fce07e)" }}>
                    <div className="w-6 h-6 border border-gray-400 shadow-sm" style={{ backgroundColor: activeColor }} />
                  </div>
                  <span className="text-[9px] mt-0.5 leading-tight text-center text-[#1e395b]">Color<br/>1</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded border border-transparent hover:border-[#f2cb1d] cursor-pointer transition-colors">
                    <div className="w-6 h-6 bg-white border border-gray-400 shadow-sm" />
                  </div>
                  <span className="text-[9px] mt-0.5 leading-tight text-center text-[#1e395b]">Color<br/>2</span>
                </div>
              </div>
              {/* Palette grid 10×3 */}
              <div className="grid border border-[#a0b0c0] p-[1px] bg-white shadow-inner flex-none" style={{ gridTemplateColumns: "repeat(10, 13px)", gridTemplateRows: "repeat(3, 13px)", gap: "1px" }}>
                {palette7.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveColor(c)}
                    className={`cursor-pointer border hover:scale-110 hover:z-10 relative transition-transform ${activeColor === c ? "border-white shadow" : "border-gray-200 hover:border-black"}`}
                    style={{ width: 13, height: 13, backgroundColor: c }}
                  />
                ))}
              </div>
              {/* Edit colors */}
              <button className="flex flex-col items-center justify-center w-10 h-[52px] rounded border border-transparent hover:border-[#f2cb1d] transition-colors ml-1 flex-none">
                <span className="text-xl mb-1">🌈</span>
                <span className="text-[9px] leading-tight text-center text-[#1e395b]">Edit<br/>colors</span>
              </button>
            </div>
          </RibbonGroup7>

        </div>
      </div>

      {/* Canvas workspace */}
      <div className="flex-grow relative overflow-auto p-[6px]" style={{ background: "#c5d9f1" }}>
        <div ref={containerRef} className="w-full h-full relative">
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 bg-white"
            style={{ cursor: getCursor(), display: "block", boxShadow: "2px 2px 6px rgba(0,0,0,0.25)" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex-shrink-0 h-[22px] flex justify-between items-center px-4 text-[11px] border-t" style={{ background: "#c5d8f1", borderColor: "#8ba8c9", color: "#1e395b" }}>
        <div className="flex items-center gap-4">
          <span>✛ {canvasDims.w} × {canvasDims.h}px</span>
          <span className="w-px h-3 bg-[#91b5e1]" />
          <span>💾 Size: 24.5KB</span>
        </div>
        <div className="flex items-center gap-2 h-full">
          <span>{zoom}%</span>
          <span className="w-px h-3 bg-[#91b5e1] mx-1" />
          <button className="px-1.5 h-full hover:bg-white/30 rounded" onClick={() => setZoom(z => Math.max(10, z - 10))}>−</button>
          <input type="range" min={10} max={400} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="w-[80px] accent-[#1853a1]" />
          <button className="px-1.5 h-full hover:bg-white/30 rounded" onClick={() => setZoom(z => Math.min(400, z + 10))}>+</button>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════
  //  WINDOWS 10 / 11
  // ════════════════════════════════════════
  return (
    <div className="w-full h-full flex flex-col select-none overflow-hidden text-[12px] bg-white" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>

      {/* Title + menu tabs */}
      <div className="flex items-end text-[12px] px-1 pt-1 flex-none border-b border-[#dfdfdf]" style={{ background: "#f3f3f3" }}>
        <div className="px-4 py-1.5 text-white rounded-t-sm flex-none cursor-pointer" style={{ background: "#0078d7" }}>File</div>
        <div className="px-4 py-1.5 bg-white border-t border-x border-[#dfdfdf] font-semibold text-black relative z-10 -mb-[1px] flex-none rounded-t">Home</div>
        <div className="px-4 py-1.5 text-[#333] hover:bg-gray-100 cursor-pointer rounded-t flex-none">View</div>
      </div>

      {/* Ribbon */}
      <div className="w-full overflow-x-auto border-b border-[#d9d9d9] bg-white flex-none">
        <div className="flex items-center px-4 py-2 h-[80px] min-w-max gap-3 flex-nowrap">

          {/* Clipboard group */}
          <Win10Group label="Clipboard">
            <div className="flex gap-1">
              <Win10BigBtn icon="📋" label="Paste" dropdown />
              <div className="flex flex-col gap-0.5">
                <Win10SmallBtn icon="✂️" label="Cut" />
                <Win10SmallBtn icon="📄" label="Copy" />
              </div>
            </div>
          </Win10Group>

          <div className="h-[60px] w-px bg-[#e2e3e4] flex-none" />

          {/* Image group */}
          <Win10Group label="Image">
            <div className="flex gap-1">
              <Win10BigBtn icon="⬚" label="Select" dropdown />
              <div className="flex flex-col gap-0.5">
                <Win10SmallBtn icon="◩" label="Crop" />
                <Win10SmallBtn icon="⤡" label="Resize" />
                <Win10SmallBtn icon="↻" label="Rotate" dropdown />
              </div>
            </div>
          </Win10Group>

          <div className="h-[60px] w-px bg-[#e2e3e4] flex-none" />

          {/* Tools group */}
          <Win10Group label="Tools">
            <div className="grid grid-cols-3 gap-1">
              {tools7.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  title={tool.label}
                  className={`w-8 h-8 flex items-center justify-center rounded border text-base transition-colors
                    ${activeTool === tool.id
                      ? "bg-[#cce8ff] border-[#99d1ff]"
                      : "border-transparent hover:bg-[#e5f3fb] hover:border-[#70c0e7]"}`}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
          </Win10Group>

          <div className="h-[60px] w-px bg-[#e2e3e4] flex-none" />

          {/* Brushes */}
          <Win10Group label="Brushes">
            <Win10BigBtn icon="🖌️" label="Brushes" dropdown />
          </Win10Group>

          <div className="h-[60px] w-px bg-[#e2e3e4] flex-none" />

          {/* Size */}
          <Win10Group label="Size">
            <div className="relative group">
              <button className="w-10 h-[52px] flex flex-col items-center justify-center rounded border border-transparent hover:bg-[#e5f3fb] hover:border-[#70c0e7] transition-colors">
                <div className="flex flex-col gap-[3px] mb-1 w-[22px]">
                  {[1,2,3,4].map(n => <div key={n} className="w-full bg-[#333]" style={{ height: `${n}px` }} />)}
                </div>
                <span className="text-[9px] text-[#333]">Size ▼</span>
              </button>
              <div className="hidden group-hover:flex flex-col absolute top-full left-0 bg-white border border-[#dfdfdf] shadow-md z-50 w-[80px] py-1 rounded">
                {brushSizes.map(s => (
                  <div key={s} onClick={() => setBrushSize(s)} className={`w-full h-6 flex items-center justify-center cursor-pointer hover:bg-[#e5f3fb] ${brushSize === s ? "bg-[#cce8ff]" : ""}`}>
                    <div className="bg-black rounded-full" style={{ width: "80%", height: `${s}px` }} />
                  </div>
                ))}
              </div>
            </div>
          </Win10Group>

          <div className="h-[60px] w-px bg-[#e2e3e4] flex-none" />

          {/* Colors */}
          <Win10Group label="Colors">
            <div className="flex items-center gap-2 h-full">
              <div className="flex gap-1 flex-none">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 flex items-center justify-center rounded border border-[#f4c278] shadow-inner" style={{ background: "#fcedd2" }}>
                    <div className="w-6 h-6 border border-gray-300 shadow-sm" style={{ backgroundColor: activeColor }} />
                  </div>
                  <span className="text-[8px] mt-0.5 leading-tight text-center text-gray-600">Color 1</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 flex items-center justify-center rounded border border-transparent hover:border-[#70c0e7] hover:bg-[#e5f3fb] cursor-pointer transition-colors">
                    <div className="w-6 h-6 bg-white border border-gray-300 shadow-sm" />
                  </div>
                  <span className="text-[8px] mt-0.5 leading-tight text-center text-gray-600">Color 2</span>
                </div>
              </div>
              {/* 10×2 grid */}
              <div className="grid border border-[#dfdfdf] p-[2px] bg-[#f9f9f9] flex-none" style={{ gridTemplateColumns: "repeat(10, 16px)", gridTemplateRows: "repeat(2, 16px)", gap: "1px" }}>
                {palette7.slice(0, 20).map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveColor(c)}
                    className={`cursor-pointer border transition-transform ${activeColor === c ? "border-[#0078d7] scale-110 shadow-sm z-10 relative" : "border-gray-300 hover:border-black"}`}
                    style={{ width: 16, height: 16, backgroundColor: c }}
                  />
                ))}
              </div>
              <button className="flex flex-col items-center justify-center w-10 h-[52px] rounded border border-transparent hover:bg-[#e5f3fb] hover:border-[#70c0e7] transition-colors ml-1 flex-none">
                <span className="text-xl mb-1">🌈</span>
                <span className="text-[9px] leading-tight text-center text-gray-600">Edit<br/>colors</span>
              </button>
            </div>
          </Win10Group>

          <div className="h-[60px] w-px bg-[#e2e3e4] flex-none" />

          {/* History actions */}
          <Win10Group label="History">
            <div className="flex gap-1">
              <Win10BigBtn icon="↩️" label="Undo" onClick={undo} />
              <Win10BigBtn icon="❌" label="Clear" onClick={clearCanvas} />
            </div>
          </Win10Group>

        </div>
      </div>

      {/* Canvas workspace */}
      <div className="flex-grow overflow-auto bg-[#e5e5e5]">
        <div ref={containerRef} className="w-full h-full relative">
          <canvas
            ref={canvasRef}
            className="absolute top-2 left-2 bg-white"
            style={{ cursor: getCursor(), display: "block", boxShadow: "2px 2px 5px rgba(0,0,0,0.2)" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex-shrink-0 h-[22px] flex justify-between items-center px-4 text-[11px] border-t border-[#d9d9d9] bg-[#f0f0f0] text-gray-600">
        <div className="flex items-center gap-4">
          <span>✛ {canvasDims.w} × {canvasDims.h}px</span>
          <span className="w-px h-3 bg-gray-400 mx-1" />
          <span>💾 24.5KB</span>
        </div>
        <div className="flex items-center gap-2 h-full">
          <span>{zoom}%</span>
          <span className="w-px h-3 bg-gray-400 mx-1" />
          <button className="px-1.5 h-full hover:bg-gray-200 rounded" onClick={() => setZoom(z => Math.max(10, z - 10))}>−</button>
          <input type="range" min={10} max={400} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="w-[80px] accent-[#0078d7]" />
          <button className="px-1.5 h-full hover:bg-gray-200 rounded" onClick={() => setZoom(z => Math.min(400, z + 10))}>+</button>
        </div>
      </div>
    </div>
  );
}

// ─── Win 7 Ribbon Sub-components ──────────────────────────────────────────────

function RibbonGroup7({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between h-full pr-2 relative border-r border-[#96b4d6] shadow-[1px_0_0_rgba(255,255,255,0.6)] ml-1 flex-none"
         style={{ boxShadow: "1px 0 0 rgba(255,255,255,0.6)" }}>
      <div className="flex items-start mt-0.5">{children}</div>
      <span className="text-center text-[10px] text-[#3b6290] pb-0.5">{label}</span>
    </div>
  );
}

function Ribbon7BigBtn({ icon, label, dropdown, onClick }: { icon: string; label: string; dropdown?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-12 h-[58px] rounded transition-colors border border-transparent hover:border-[#f2cb1d]"
      style={{ background: "none" }}
      onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(to bottom, #fcf4d4, #fced9a)")}
      onMouseLeave={e => (e.currentTarget.style.background = "none")}
    >
      <span className="text-3xl drop-shadow-sm mb-1">{icon}</span>
      <span className="text-[10px] leading-none text-[#1e395b]">{label}{dropdown ? <span className="text-[8px] ml-1">▼</span> : null}</span>
    </button>
  );
}

function Ribbon7SmallBtn({ icon, label, dropdown, onClick }: { icon: string; label: string; dropdown?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] flex items-center gap-1 border border-transparent hover:border-[#f2cb1d] rounded px-1 py-[3px] text-[#1e395b] whitespace-nowrap"
      onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(to bottom, #fcf4d4, #fced9a)")}
      onMouseLeave={e => (e.currentTarget.style.background = "none")}
    >
      <span className="text-xs opacity-60">{icon}</span> {label}{dropdown ? <span className="text-[8px] ml-0.5">▼</span> : null}
    </button>
  );
}

// ─── Win 10 Ribbon Sub-components ─────────────────────────────────────────────

function Win10Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-none">
      <div className="flex items-center gap-1 flex-grow">{children}</div>
      <span className="text-[10px] text-gray-500 whitespace-nowrap">{label}</span>
    </div>
  );
}

function Win10BigBtn({ icon, label, dropdown, onClick }: { icon: string; label: string; dropdown?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-12 h-[52px] rounded border border-transparent hover:bg-[#e5f3fb] hover:border-[#70c0e7] transition-colors text-[11px] text-[#333]"
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span>{label}{dropdown ? <span className="text-[8px] ml-0.5">▼</span> : null}</span>
    </button>
  );
}

function Win10SmallBtn({ icon, label, dropdown, onClick }: { icon: string; label: string; dropdown?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded border border-transparent hover:bg-[#e5f3fb] hover:border-[#70c0e7] transition-colors text-[11px] text-[#333] whitespace-nowrap"
    >
      <span className="text-xs opacity-60">{icon}</span>
      {label}
      {dropdown ? <span className="text-[8px] ml-0.5">▼</span> : null}
    </button>
  );
}