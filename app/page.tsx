"use client";

import { useState } from "react";
import { 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Image as ImageIcon, 
  AlertCircle,
  Play,
  HelpCircle,
  ShieldCheck,
  FileText,
  Mail,
  Info,
  X
} from "lucide-react";

interface ThumbnailQuality {
  label: string;
  res: string;
  tag: string;
  badge?: string;
  url: string;
}

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const extractVideoDetails = (url: string) => {
    setError(null);
    const trimmed = url.trim();

    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
    const ytMatch = trimmed.match(ytRegex);

    if (ytMatch && ytMatch[1]) {
      setVideoId(ytMatch[1]);
      return;
    }

    if (trimmed.length > 0) {
      setError("Please paste a valid YouTube video or Shorts URL.");
    }
    setVideoId(null);
  };

  // Canvas drawing bypasses CORS restrictions and downloads the real JPG directly to disk
  const triggerDownload = (imgUrl: string, filename: string, index: number) => {
    setDownloadingIndex(index);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            window.open(imgUrl, "_blank");
          }
          setDownloadingIndex(null);
        }, "image/jpeg", 0.95);
      } else {
        window.open(imgUrl, "_blank");
        setDownloadingIndex(null);
      }
    };

    img.onerror = () => {
      window.open(imgUrl, "_blank");
      setDownloadingIndex(null);
    };
  };

  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const thumbnails: ThumbnailQuality[] = videoId ? [
    {
      label: "Maximum HD (1080p / 4K)",
      res: "1920 × 1080",
      tag: "Best for high-res banners & artwork",
      badge: "Ultra HD",
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    },
    {
      label: "Standard Definition (HD)",
      res: "1280 × 720",
      tag: "YouTube standard recommended resolution",
      badge: "HD",
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
    },
    {
      label: "High Quality (HQ)",
      res: "480 × 360",
      tag: "Medium resolution compressed thumbnail",
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    },
    {
      label: "Medium Quality (MQ)",
      res: "320 × 180",
      tag: "Compact mobile layout size",
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    }
  ] : [];

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col justify-between selection:bg-rose-500/30">
      {/* Top Header */}
      <header className="w-full border-b border-zinc-800/40 bg-[#0a0d14]/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ef233c] flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Play className="w-4 h-4 fill-white text-white translate-x-[1px]" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white">
              Thumbnail <span className="text-[#ef233c]">Copy</span>
            </span>
          </div>

          <span className="text-[11px] font-medium px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400">
            100% Free • No Watermarks
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-5 pt-12 pb-20 w-full flex flex-col items-center">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Direct 4K & Full HD Downloader
        </div>

        {/* Hero Title */}
        <div className="text-center mb-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.15]">
            Download High-Res
            <span className="block mt-1 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              YouTube
            </span>
            <span className="block bg-gradient-to-r from-rose-400 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              Thumbnails
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed mb-8">
          Extract crisp full-resolution cover art from any YouTube video or Short in one click. Completely uncompressed.
        </p>

        {/* Input Bar */}
        <div className="w-full mb-8">
          <div className="relative flex items-center bg-[#10141f] border border-zinc-800/90 rounded-2xl p-1.5 shadow-xl shadow-black/40 focus-within:border-zinc-700 transition">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                extractVideoDetails(e.target.value);
              }}
              placeholder="Paste YouTube link here (e.g. https://...)"
              className="w-full bg-transparent px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => extractVideoDetails(inputUrl)}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#e62939] hover:bg-[#d02433] rounded-xl transition shadow-md whitespace-nowrap active:scale-95"
            >
              Extract
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results or Empty State */}
        {thumbnails.length > 0 ? (
          <div className="w-full space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Available Resolutions ({thumbnails.length})
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                ID: {videoId}
              </span>
            </div>

            <div className="space-y-4">
              {thumbnails.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#10141f] border border-zinc-800/90 rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="relative aspect-video w-full bg-zinc-950">
                    <img 
                      src={item.url} 
                      alt={item.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold bg-[#e62939] text-white rounded">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[11px] font-mono bg-black/80 backdrop-blur-md text-zinc-300 rounded">
                      {item.res}
                    </span>
                  </div>

                  <div className="p-3.5 flex flex-col gap-3">
                    <div>
                      <h3 className="font-semibold text-zinc-100 text-xs sm:text-sm">
                        {item.label}
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        {item.tag}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => triggerDownload(item.url, `thumbnail-${videoId}-${item.res.replace(/\s/g, "")}.jpg`, idx)}
                        disabled={downloadingIndex === idx}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition active:scale-95 disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {downloadingIndex === idx ? "Processing..." : "Download"}
                      </button>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.url, idx)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                        title="Copy direct link"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full border border-dashed border-zinc-800/80 bg-[#10141f]/70 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-400">
              <ImageIcon className="w-5 h-5 text-zinc-400 stroke-[1.5]" />
            </div>
            <h3 className="text-zinc-200 font-semibold text-xs sm:text-sm mb-1">
              No video link loaded yet
            </h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed max-w-xs">
              Paste any public YouTube standard video, Shorts URL, or stream link above to preview all available resolutions.
            </p>
          </div>
        )}

        {/* SEO & FAQ Guidelines */}
        <section className="mt-16 pt-10 border-t border-zinc-800/60 text-zinc-400 text-xs leading-relaxed space-y-6 w-full">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              How Thumbnail Copy Works
            </h2>
            <p className="text-zinc-400 text-[11px]">
              Thumbnail Copy directly queries uncompressed preview assets generated by YouTube static servers (<code className="text-zinc-300">img.youtube.com</code>). It accesses resolutions up to 1920×1080 without lossy client compression.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#e62939]" /> Frequently Asked Questions
            </h3>
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <h4 className="font-semibold text-zinc-200 text-[11px] mb-1">Can I grab thumbnails from YouTube Shorts?</h4>
              <p className="text-[10px] text-zinc-400">Yes, paste any Shorts link to fetch and copy the cover art.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <h4 className="font-semibold text-zinc-200 text-[11px] mb-1">Is this service free?</h4>
              <p className="text-[10px] text-zinc-400">Yes, 100% free with unlimited extractions.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-[#07090e] py-6 px-5 text-[11px] text-zinc-500">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Thumbnail Copy. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveModal("privacy")} className="hover:text-zinc-300">Privacy</button>
            <button onClick={() => setActiveModal("terms")} className="hover:text-zinc-300">Terms</button>
            <button onClick={() => setActiveModal("about")} className="hover:text-zinc-300">About</button>
            <button onClick={() => setActiveModal("contact")} className="hover:text-zinc-300">Contact</button>
          </div>
        </div>
      </footer>

      {/* Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#10141f] border border-zinc-800 rounded-2xl p-5 text-xs text-zinc-300">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {activeModal === "privacy" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <ShieldCheck className="w-4 h-4 text-rose-500" /> Privacy Policy
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Thumbnail Copy does not store personal credentials or session data. All operations happen directly inside the client browser.
                </p>
              </div>
            )}

            {activeModal === "terms" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <FileText className="w-4 h-4 text-rose-500" /> Terms of Service
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Intended for design reference, education, and archiving under fair-use principles.
                </p>
              </div>
            )}

            {activeModal === "about" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Info className="w-4 h-4 text-rose-500" /> About Thumbnail Copy
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Thumbnail Copy is a minimalist web tool built for creators to extract uncompressed YouTube video graphics without ads or bloatware.
                </p>
              </div>
            )}

            {activeModal === "contact" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Mail className="w-4 h-4 text-rose-500" /> Contact
                </div>
                <p className="text-zinc-400 text-[11px]">Send inquiries or feedback to:</p>
                <div className="p-2.5 bg-black/50 border border-zinc-800 rounded-lg text-[#ef233c] font-mono select-all text-[11px]">
                  contact@thumbnailcopy.app
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
