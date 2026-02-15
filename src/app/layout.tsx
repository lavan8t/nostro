import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "nostro",
  description: "Windows Multi-OS Simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Windows 7 CSS Framework (Scoped) */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/7.css/dist/7.scoped.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
