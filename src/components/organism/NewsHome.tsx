"use client";

import useSWR from "swr";
import NewsCard from "../moleculs/NewsCard";

interface Kategori {
  id: number;
  name: string;
  slug: string;
}

type TitleVariants = {
  default?: string;
  sg?: string;
  [key: string]: string | undefined;
};

interface Berita {
  id: number;
  title: string;
  titles?: TitleVariants; // dukung variasi judul
  slug: string;
  content: string;
  category_id: number;
  kategori: Kategori | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

/** Peta kategori: slug halaman -> daftar nama kategori pada data */
const kategoriMap: Record<string, string[]> = {
  indexNews: ["Nikkei", "Hang seng"],
  commodityNews: ["Gold", "Silver", "Oil"],
  currenciesNews: [
    "EUR/USD",
    "USD/JPY",
    "USD/CHF",
    "AUD/USD",
    "GBP/USD",
    "US DOLLAR",
  ],
  // samakan dengan nama kategori di API:
  economicNews: ["Global Economics"],
  fiscalMoneter: ["Fiscal & Moneter"],
  analisisMarket: ["Analisis Market"],
  analisisOpini: ["Analisis & Opini"],
};

/** Reverse lookup: dari nama kategori (di data) -> slug halaman (key di kategoriMap) */
function getKategoriSlugFromName(name?: string): string | null {
  if (!name) return null;
  const n = name.trim().toLowerCase();
  for (const [slug, names] of Object.entries(kategoriMap)) {
    if (names.some((x) => x.trim().toLowerCase() === n)) return slug;
  }
  return null;
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

function mediaUrl(p?: string) {
  if (!p) return "/placeholder.jpg";
  if (/^https?:\/\//i.test(p)) return p;
  const base =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://portalnews.newsmaker.id";
  return `${base}/${p.replace(/^\/+/, "")}`;
}

/** fetcher dasar (no-store untuk selalu fresh) */
const fetcher = (url: string) =>
  fetch(url, { headers: { accept: "application/json" }, cache: "no-store" }).then(
    (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`);
      return r.json();
    }
  );

/** Ambil array dari berbagai bentuk respons */
function pickArray<T = unknown>(raw: any): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && Array.isArray(raw.data)) return raw.data as T[];
  if (raw && raw.data && Array.isArray(raw.data.data))
    return raw.data.data as T[];
  return [];
}

/** Ambil judul dengan prioritas: sg -> default -> title */
function pickTitle(item: Berita): string {
  const t = item.titles ?? {};
  const candidates = [t.sg, t.default, item.title];
  return (
    candidates.find((s): s is string => !!s && s.trim().length > 0) ?? ""
  );
}

export default function NewsHome() {
  const { data, error, isLoading } = useSWR("https://portalnews.newsmaker.id/api/berita", fetcher, {
    refreshInterval: 15_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    keepPreviousData: true,
    dedupingInterval: 0,
  });

  // Normalisasi -> sort desc by created_at -> ambil 3 teratas
  const news: Berita[] = pickArray<Berita>(data)
    .filter((b) => b && typeof b.id === "number" && typeof b.slug === "string")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10" data-aos="fade-up">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-yellow-500 font-semibold">READ MORE</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Latest News Updates
        </h1>
      </div>

      {/* Konten */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700"
            >
              <div className="h-48 w-full bg-neutral-700 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-24 bg-neutral-700 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-neutral-700 rounded animate-pulse" />
                <div className="h-4 w-full bg-neutral-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-400">Gagal memuat berita.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => {
            const cleanDescription = stripHtml(item.content)
              .replace(/&nbsp;/g, " ")
              .trim();
            const img = mediaUrl(item.images?.[0]);
            const mappedKategoriSlug = getKategoriSlugFromName(
              item.kategori?.name
            );
            const href =
              mappedKategoriSlug && item.slug
                ? `/${encodeURIComponent(mappedKategoriSlug)}/${encodeURIComponent(
                  item.slug
                )}`
                : "/#";

            return (
              <NewsCard
                key={item.id}
                image={img}
                title={pickTitle(item)}
                category={item.kategori?.name || "-"}
                description={cleanDescription}
                href={href}
              />
            );
          })}

          {news.length === 0 && (
            <div className="col-span-full text-center text-gray-300">
              Tidak ada berita terbaru.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
