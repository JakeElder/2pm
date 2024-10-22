import type { Metadata } from "next";
import "reset-css";
import "@2pm/ui/globals.css";

export const metadata: Metadata = {
  title: "2PM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
