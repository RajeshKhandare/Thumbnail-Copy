import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thumbnail Copy - Free YouTube Thumbnail Downloader (4K & HD)",
  description:
    "Extract and download high-resolution YouTube and Vimeo thumbnails in 1080p, 720p, and 480p for free with Thumbnail Copy.",
  keywords: [
    "thumbnail copy",
    "youtube thumbnail downloader",
    "copy youtube thumbnail",
    "download youtube thumbnail hd",
    "get youtube thumbnail 1080p"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
