import "./globals.css";
import type { Metadata } from "next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex-col justify-center px-10 py-5">{children}</body>
    </html>
  );
}
