import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExpenseTrack",
  description: "Track every rupee with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-body-md selection:bg-primary selection:text-on-primary antialiased bg-background text-on-background min-h-screen">
        {children}
      </body>
    </html>
  );
}
