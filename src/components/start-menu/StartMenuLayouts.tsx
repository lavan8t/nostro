import React from "react";
import { Icons } from "../Icons";

type LaunchFn = (id: string) => void;

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function Win7AppRow({
  name,
  color,
  onClick,
}: {
  name: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-1 px-2 hover:bg-sky-100 hover:shadow-[inset_0_0_0_1px_rgba(100,180,255,0.5)] w-full text-left rounded-sm transition-colors group"
    >
      <div
        className="w-7 h-7 flex items-center justify-center rounded-sm shadow-sm"
        style={{ backgroundColor: color }}
      >
        <div className="w-3 h-3 bg-white/30" />
      </div>
      <span className="text-xs text-gray-800 font-medium">{name}</span>
    </button>
  );
}

function Win7LinkRow({ label, bold }: { label: string; bold?: boolean }) {
  return (
    <button
      className={`w-full text-left px-2 py-1.5 hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded-sm transition-all text-white ${bold ? "font-bold" : "font-normal"}`}
    >
      {label}
    </button>
  );
}

function Win10AppRow({
  name,
  onClick,
}: {
  name: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-2 hover:bg-white/10 w-full text-left rounded-sm transition-colors"
    >
      <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-xs">
        {name.charAt(0)}
      </div>
      <span className="text-sm">{name}</span>
    </button>
  );
}

function Win10Tile({ size, color, label, icon, textColor = "white" }: any) {
  const sizeClasses: any = {
    small: "col-span-1 row-span-1 h-[50px]",
    medium: "col-span-2 row-span-2 h-[100px]",
    wide: "col-span-4 row-span-2 h-[100px]",
    large: "col-span-4 row-span-4 h-[204px]",
  };
  return (
    <div
      className={`${sizeClasses[size]} p-2 flex flex-col justify-between hover:brightness-110 active:scale-95 transition-all cursor-default`}
      style={{ backgroundColor: color, color: textColor }}
    >
      <div className="flex-1 flex items-center justify-center">{icon}</div>
      <span className="text-xs font-medium truncate">{label}</span>
    </div>
  );
}

function MenuItem({ label, icon, onClick, hasSubmenu }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1 hover:bg-[var(--Hilight)] hover:text-[var(--HilightText)] w-full text-left group"
      style={{ color: "var(--MenuText)" }}
    >
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span className="flex-1">{label}</span>
      {hasSubmenu && <Icons.ArrowRight />}
    </button>
  );
}

// --------------------------------------------------
// LAYOUTS
// --------------------------------------------------

export const Win7StartMenu = ({ handleLaunch }: { handleLaunch: LaunchFn }) => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes win7-fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-win7 { animation: win7-fade-in 0.2s ease-out forwards; }
          .win7-glass { background: linear-gradient(to bottom, rgba(20, 30, 50, 0.95) 0%, rgba(20, 30, 50, 0.98) 100%); box-shadow: 0 0 0 1px rgba(255,255,255,0.2) inset, 0 0 10px rgba(0,0,0,0.5); backdrop-filter: blur(15px); }
          .win7-search-box { box-shadow: inset 1px 1px 2px rgba(0,0,0,0.4), inset -1px -1px 1px rgba(255,255,255,0.2); background: #fff; border: 1px solid #555; }
          .win7-shutdown-btn { background: linear-gradient(to bottom, #f3d675 0%, #e2a02d 50%, #e49216 51%, #e6a73c 100%); border: 1px solid #8f6d28; box-shadow: inset 0 1px 0 rgba(255,255,255,0.4); }
          .win7-shutdown-btn:hover { background: linear-gradient(to bottom, #f7df92 0%, #ebb149 50%, #eba233 51%, #f0c36e 100%); box-shadow: 0 0 5px rgba(232, 182, 59, 0.6), inset 0 1px 0 rgba(255,255,255,0.4); }
      `,
        }}
      />
      <div
        className="absolute bottom-[40px] left-0 w-[420px] h-[550px] flex rounded-t-lg overflow-hidden animate-win7 z-[99999] win7-glass"
        style={{ fontFamily: "'Segoe UI', sans-serif" }}
      >
        <div className="flex-1 bg-white m-[2px] mr-0 rounded-tl-[4px] rounded-bl-[4px] flex flex-col border border-r-0 border-[rgba(0,0,0,0.3)]">
          <div className="flex-1 p-2 overflow-y-auto space-y-1">
            <Win7AppRow
              name="Getting Started"
              color="#2b5797"
              onClick={() => handleLaunch("wnd-intro")}
            />
            <Win7AppRow name="Windows Media Center" color="#00cc6a" />
            <Win7AppRow name="Calculator" color="#333" />
            <Win7AppRow name="Sticky Notes" color="#e8bc3b" />
            <Win7AppRow name="Snipping Tool" color="#d13438" />
            <Win7AppRow
              name="Paint"
              color="orange"
              onClick={() => handleLaunch("wnd-paint")}
            />
            <Win7AppRow name="Remote Desktop Connection" color="#2b5797" />
            <Win7AppRow name="Magnifier" color="#881798" />
            <Win7AppRow name="Solitaire" color="green" />
            <div className="h-4" />
            <Win7AppRow
              name="Notepad"
              color="#444"
              onClick={() => handleLaunch("wnd-notepad")}
            />
          </div>
          <div className="p-3 pb-3">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-2" />
            <button className="flex items-center gap-1 font-semibold text-gray-700 hover:text-black hover:bg-blue-50 px-2 py-1.5 rounded transition-colors w-full mb-3">
              <span>All Programs</span>
              <div className="ml-auto text-gray-500">
                <Icons.ArrowRight />
              </div>
            </button>
            <div className="relative w-full h-[30px] rounded-sm win7-search-box flex items-center px-2">
              <input
                type="text"
                placeholder="Search programs and files"
                className="w-full bg-transparent border-none text-sm italic text-gray-600 focus:outline-none placeholder-gray-400"
              />
              <div className="text-gray-400">
                <Icons.Search />
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-[160px] text-white py-2 px-1 flex flex-col text-sm relative"
          style={{ textShadow: "0 0 5px rgba(0,0,0,0.9)" }}
        >
          <div className="absolute top-[-25px] right-[25px] w-[50px] h-[50px] bg-orange-200 rounded-md border border-[rgba(0,0,0,0.5)] shadow-[0_2px_5px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center z-10">
            <div className="opacity-80">
              <Icons.User />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          </div>
          <div className="h-[30px]" />
          <div className="space-y-1 mt-1">
            <Win7LinkRow label="Tiffany" bold />
            <Win7LinkRow label="Documents" />
            <Win7LinkRow label="Pictures" />
            <Win7LinkRow label="Music" />
            <div className="h-[1px] bg-white/10 my-1 mx-3" />
            <Win7LinkRow label="Games" />
            <Win7LinkRow label="Computer" />
            <div className="h-[1px] bg-white/10 my-1 mx-3" />
            <Win7LinkRow label="Control Panel" />
            <Win7LinkRow label="Devices and Printers" />
            <Win7LinkRow label="Default Programs" />
            <Win7LinkRow label="Help and Support" />
          </div>
          <div className="mt-auto mb-2 px-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-sm w-fit ml-auto transition-all text-black win7-shutdown-btn">
              <span className="text-xs font-semibold">Shut down</span>
              <div className="pl-1 border-l border-black/20 text-black/70">
                <Icons.ArrowRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const Win10StartMenu = ({
  handleLaunch,
}: {
  handleLaunch: LaunchFn;
}) => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .win10-scrollbar::-webkit-scrollbar { width: 2px; background-color: #1f1f1f; transition: width 0.2s; }
          .win10-scrollbar:hover::-webkit-scrollbar { width: 14px; }
          .win10-scrollbar::-webkit-scrollbar-thumb { background-color: #888; border: 4px solid transparent; background-clip: content-box; }
          .win10-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #999; border: 2px solid #1f1f1f; }
          .win10-scrollbar::-webkit-scrollbar-track { background-color: #1f1f1f; }
          @keyframes win10-grow { 0% { transform: translateY(20px) scale(0.95); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
          @keyframes win10-slide-up { 0% { transform: translateY(40px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
          .animate-win10-grow { animation: win10-grow 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; transform-origin: bottom left; }
          .animate-win10-row { opacity: 0; animation: win10-slide-up 0.5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
      `,
        }}
      />
      <div
        className="absolute bottom-[40px] left-0 h-[550px] w-[680px] bg-[#1f1f1f] text-white flex shadow-2xl z-[99999] animate-win10-grow"
        style={{
          fontFamily: "var(--os-font)",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          border: "1px solid #333",
        }}
      >
        <div className="w-[48px] flex flex-col items-center justify-between py-2 pb-4 bg-[#1f1f1f]">
          <div className="flex flex-col gap-4">
            <button className="w-[48px] h-[48px] flex items-center justify-center hover:bg-white/10 transition-colors">
              <Icons.Menu />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <button className="w-[48px] h-[48px] flex items-center justify-center hover:bg-white/10 transition-colors rounded-sm">
              <div className="w-6 h-6 rounded-full bg-gray-400 overflow-hidden">
                <Icons.User />
              </div>
            </button>
            <button className="w-[48px] h-[48px] flex items-center justify-center hover:bg-white/10 transition-colors">
              <Icons.Settings />
            </button>
            <button className="w-[48px] h-[48px] flex items-center justify-center hover:bg-white/10 transition-colors">
              <Icons.Power />
            </button>
          </div>
        </div>
        <div className="w-[240px] flex flex-col py-2 px-2 overflow-y-auto win10-scrollbar">
          <div className="animate-win10-row" style={{ animationDelay: "0ms" }}>
            <div className="text-xs font-semibold mb-2 mt-2 px-3">
              Most used
            </div>
            <div className="flex flex-col">
              <Win10AppRow
                name="Google Chrome"
                onClick={() => handleLaunch("wnd-browser")}
              />
              <Win10AppRow
                name="Visual Studio Code"
                onClick={() => handleLaunch("wnd-code")}
              />
              <Win10AppRow
                name="File Explorer"
                onClick={() => handleLaunch("wnd-explorer")}
              />
            </div>
          </div>
          <div className="animate-win10-row" style={{ animationDelay: "50ms" }}>
            <div className="text-xs font-semibold mb-2 mt-4 px-3">S</div>
            <div className="flex flex-col">
              <Win10AppRow name="Settings" />
              <Win10AppRow name="Snipping Tool" />
              <Win10AppRow name="Spotify" />
              <Win10AppRow name="Sticky Notes" />
            </div>
          </div>
          <div
            className="animate-win10-row"
            style={{ animationDelay: "100ms" }}
          >
            <div className="text-xs font-semibold mb-2 mt-4 px-3">W</div>
            <div className="flex flex-col">
              <Win10AppRow name="Windows Security" />
              <Win10AppRow name="Word" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-[#1f1f1f] win10-scrollbar">
          <div
            className="animate-win10-row"
            style={{ animationDelay: "150ms" }}
          >
            <div className="text-sm font-semibold mb-3 ml-1">Productivity</div>
            <div className="grid grid-cols-4 gap-1">
              <Win10Tile
                size="medium"
                color="#3C3C3C"
                label="Android Studio"
                icon={<div className="text-3xl">🤖</div>}
              />
              <Win10Tile
                size="medium"
                color="#FF9900"
                label="Everything"
                icon={<div className="text-3xl">🔍</div>}
              />
              <Win10Tile
                size="wide"
                color="#0071C5"
                label="Intel® Graphics"
                icon={<div className="text-white font-bold text-lg">intel</div>}
              />
              <Win10Tile
                size="large"
                color="#E60012"
                label="Vantage"
                icon={<div className="text-[100px] font-bold">L</div>}
              />
              <div className="col-span-2 grid grid-cols-2 gap-1 content-start">
                <Win10Tile
                  size="medium"
                  color="#FFEB3B"
                  label="SumatraPDF"
                  textColor="black"
                  icon={<div className="text-xl">📄</div>}
                />
                <Win10Tile
                  size="medium"
                  color="#000000"
                  label="Terminal"
                  icon={<div className="text-xl">_</div>}
                />
                <Win10Tile
                  size="medium"
                  color="#333333"
                  label="PowerToys"
                  icon={<div className="text-xl">🛠</div>}
                />
                <Win10Tile
                  size="medium"
                  color="#555555"
                  label="GIMP"
                  icon={<div className="text-xl">🎨</div>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const WinXPStartMenu = ({
  handleLaunch,
}: {
  handleLaunch: LaunchFn;
}) => {
  return (
    <div
      className="absolute bottom-[30px] left-0 w-[380px] rounded-t-lg shadow-2xl overflow-hidden font-sans select-none z-[99999]"
      style={{
        border: "2px solid #0058ee",
        boxShadow: "4px 4px 12px rgba(0,0,0,0.5)",
        fontFamily: "var(--os-font)",
      }}
    >
      <div
        className="h-16 flex items-center px-2 gap-3"
        style={{
          background: "linear-gradient(180deg, #1d60cf 0%, #1550b5 100%)",
          boxShadow: "inset 0 2px 2px rgba(255,255,255,0.4)",
        }}
      >
        <div className="w-10 h-10 rounded-sm bg-blue-100 border-2 border-white/40 overflow-hidden shadow-sm relative flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-orange-400"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg drop-shadow-md">
          Administrator
        </span>
      </div>
      <div className="flex h-[380px] bg-white border-t border-[#003c74]">
        <div className="flex-1 flex flex-col py-2 bg-white">
          <div className="px-2 space-y-1">
            <button className="w-full flex items-center gap-2 p-2 hover:bg-[#2f71cd] hover:text-white rounded transition-colors group text-left">
              <Icons.Browser />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-800 group-hover:text-white">
                  Internet
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-200">
                  Internet Explorer
                </span>
              </div>
            </button>
            <button className="w-full flex items-center gap-2 p-2 hover:bg-[#2f71cd] hover:text-white rounded transition-colors group text-left">
              <Icons.Default />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-800 group-hover:text-white">
                  E-mail
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-200">
                  Outlook Express
                </span>
              </div>
            </button>
          </div>
          <div className="my-2 mx-2 border-t border-gray-200" />
          <div className="px-2 space-y-1">
            <button
              onClick={() => handleLaunch("wnd-notepad")}
              className="w-full flex items-center gap-2 p-1 hover:bg-[#2f71cd] hover:text-white rounded transition-colors text-left"
            >
              <Icons.App color="#2f71cd" />
              <span className="text-sm text-gray-800 hover:text-white">
                Notepad
              </span>
            </button>
            <button
              onClick={() => handleLaunch("wnd-paint")}
              className="w-full flex items-center gap-2 p-1 hover:bg-[#2f71cd] hover:text-white rounded transition-colors text-left"
            >
              <Icons.App color="orange" />
              <span className="text-sm text-gray-800 hover:text-white">
                Paint
              </span>
            </button>
          </div>
          <div className="mt-auto px-4 py-2 text-center">
            <button className="bg-white font-bold text-gray-700 text-sm hover:underline">
              All Programs
              <span className="ml-2 inline-block w-0 h-0 border-l-[4px] border-l-green-600 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent align-middle" />
            </button>
          </div>
        </div>
        <div className="w-[140px] bg-[#d3e5fa] border-l border-[#95bdee] py-2 text-sm text-[#001c57]">
          <div className="space-y-1 px-1">
            <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#2f71cd] hover:text-white transition-colors text-left">
              <span className="font-bold">My Documents</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#2f71cd] hover:text-white transition-colors text-left">
              <span className="font-bold">My Pictures</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#2f71cd] hover:text-white transition-colors text-left">
              <span className="font-bold">My Music</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#2f71cd] hover:text-white transition-colors text-left">
              <span className="font-bold">My Computer</span>
            </button>
          </div>
          <div className="my-2 mx-2 border-t border-[#95bdee]" />
          <div className="space-y-1 px-1">
            <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#2f71cd] hover:text-white transition-colors text-left">
              <span>Control Panel</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-[#2f71cd] hover:text-white transition-colors text-left">
              <span>Run...</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className="h-10 flex items-center justify-end px-3 gap-3"
        style={{
          background: "linear-gradient(180deg, #3884e6 0%, #3884e6 100%)",
          borderTop: "1px solid #003c74",
          boxShadow: "inset 0 3px 3px rgba(0,0,0,0.1)",
        }}
      >
        <button className="flex items-center gap-1 text-white hover:brightness-110">
          <div className="bg-[#e59700] p-[2px] rounded-sm border border-white/50 shadow-sm">
            <Icons.Power />
          </div>
          <span className="text-sm">Log Off</span>
        </button>
        <button className="flex items-center gap-1 text-white hover:brightness-110 ml-2">
          <div className="bg-[#d64a28] p-[2px] rounded-sm border border-white/50 shadow-sm">
            <Icons.Power />
          </div>
          <span className="text-sm">Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
};

export const WinClassicStartMenu = ({
  handleLaunch,
  osIndex,
}: {
  handleLaunch: LaunchFn;
  osIndex: number;
}) => {
  return (
    <div
      className="absolute bottom-[28px] left-0 min-w-[200px] border shadow-xl z-[99999]"
      style={{
        backgroundColor: "var(--Menu)",
        borderTop: "1px solid var(--ButtonHilight)",
        borderLeft: "1px solid var(--ButtonHilight)",
        borderRight: "1px solid var(--ButtonDkShadow)",
        borderBottom: "1px solid var(--ButtonDkShadow)",
        padding: "2px",
        fontFamily: "var(--os-font)",
      }}
    >
      <div className="flex">
        {osIndex === 0 && (
          <div
            className="w-6 bg-[#000080] text-white flex items-end justify-center pb-2 mr-1"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            <span className="font-bold text-lg tracking-widest">Windows</span>
            <span className="font-normal text-lg tracking-widest ml-1">98</span>
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <MenuItem
            label="Programs"
            icon={<Icons.App color="gold" />}
            hasSubmenu
          />
          <MenuItem
            label="Documents"
            icon={<Icons.App color="gold" />}
            hasSubmenu
          />
          <MenuItem label="Settings" icon={<Icons.Settings />} hasSubmenu />
          <MenuItem label="Find" icon={<Icons.App color="blue" />} />
          <MenuItem label="Help" icon={<Icons.Settings />} />
          <MenuItem label="Run..." icon={<Icons.App color="blue" />} />
          <div className="border-t border-[var(--ButtonShadow)] border-b border-[var(--ButtonHilight)] my-1" />
          <MenuItem
            label="Notepad"
            icon={<Icons.App />}
            onClick={() => handleLaunch("wnd-notepad")}
          />
          <MenuItem
            label="Paint"
            icon={<Icons.App color="orange" />}
            onClick={() => handleLaunch("wnd-paint")}
          />
          <div className="border-t border-[var(--ButtonShadow)] border-b border-[var(--ButtonHilight)] my-1" />
          <MenuItem label="Shut Down..." icon={<Icons.Power />} />
        </div>
      </div>
    </div>
  );
};
