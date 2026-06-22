import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "upcycl3d | Premium Upcycled Streetwear",
  description:
    "Immersive storefront for upcycl3d featuring interactive denim drops, footwear and curated accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
