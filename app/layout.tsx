import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Givebear Connect demo",
  description: "A minimal Connect with Givebear example app.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
