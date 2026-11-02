import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maoni — Our Maoni. Our Opinion.",
  description: "A Nairobi discussion club and third space for open conversations, games and community.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
