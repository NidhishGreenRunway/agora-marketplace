import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agora — AI Agent Marketplace",
  description: "Hire an AI agent for any job — by the task, the month, or for keeps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
