import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My ToDo APP Final",
  description: "ToDo App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}