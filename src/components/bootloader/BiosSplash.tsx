"use client";

import React, { useEffect, useState } from "react";

export default function BiosSplash({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < 4) {
      const timer = setTimeout(() => setStep((prev) => prev + 1), 500);
      return () => clearTimeout(timer);
    } else if (step === 4) {
      const timer = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <div
      className="h-screen w-screen bg-black flex flex-col p-6 text-[#c0c0c0] cursor-none select-none overflow-hidden relative"
      style={{
        fontFamily: "Courier, monospace",
        fontWeight: "bold",
        fontSize: "15px",
        lineHeight: "1.2",
      }}
    >
      <pre className="text-red-500 mb-6" style={{ lineHeight: "1.1" }}>
        {`███╗   ██╗ ██████╗ ███████╗████████╗██████╗  ██████╗ 
████╗  ██║██╔═══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗
██╔██╗ ██║██║   ██║███████╗   ██║   ██████╔╝██║   ██║
██║╚██╗██║██║   ██║╚════██║   ██║   ██╔══██╗██║   ██║
██║ ╚████║╚██████╔╝███████║   ██║   ██║  ██║╚██████╔╝
╚═╝  ╚═══╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝`}
      </pre>

      <div className="mb-4">NOSTROBIOS(C)2026 Nostro Virtual Systems, Inc.</div>

      {step >= 1 && (
        <div className="mb-4">
          NOSTRO WEB ENGINE VIRTUAL ACPI BIOS Revision 1.0.4
          <br />
          CPU: Virtual DOM Processor 6-Core
          <br />
          Speed: Turbo
          <br />
          <br />
          Total Memory: 16384MB (VRAM-Allocated)
        </div>
      )}

      {step >= 2 && (
        <div className="mb-4">
          Virtual Devices total: 1 Keyboard, 1 Mouse, 0 Hub
          <br />
          Virtual Drive #0: LocalStorage
        </div>
      )}

      {step >= 3 && (
        <div className="mb-8">
          Detected Devices...
          <br />
          VIRTUAL_1: Nostro OS Core
          <br />
          VIRTUAL_2: User Data Partition
          <br />
        </div>
      )}

      {step >= 4 && (
        <div className="mb-4">
          Please enter setup to configure Virtual Environments.
          <br />
          When storage configuration is built, ensure local caching is enabled.
        </div>
      )}

      <div className="absolute bottom-6 left-6">
        <span className="text-white">Press Right Arrow to enter Boot Menu</span>
        <br />
        <span className="text-white">
          Press D to boot directly to Desktop (Last Selected OS)
        </span>
        <br />
        Press DEL to Run SETUP
      </div>
    </div>
  );
}
