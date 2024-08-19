import type { Metadata } from "next";
import "@2pm/ui/globals.css";

export const metadata: Metadata = {
  title: "2PM",
};

export default function RootLayout({
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
