"use client";

import useSWR from "swr";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import MarketUpdateCard from "../moleculs/MarketUpdateCard";

type Quote = { symbol: string; last: number; valueChange: number; percentChange: number };

const fetcher = (url: string) =>
    fetch(url, { headers: { accept: "application/json" }, cache: "no-store" }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`);
        return r.json();
    });

export default function MarketUpdate() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, error, isValidating, mutate } = useSWR<Quote[]>(
        "https://endpoapi-production-3202.up.railway.app/api/quotes",
        async (url) => {
            const raw = await fetcher(url);
            // pastikan selalu array agar tidak pernah undefined
            if (Array.isArray(raw)) return raw as Quote[];
            if (raw?.data && Array.isArray(raw.data)) return raw.data as Quote[];
            return []; // fallback aman
        },
        {
            refreshInterval: 5_000,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            keepPreviousData: true,     // <- penting
            fallbackData: [],           // <- penting (hindari data undefined)
            // HINDARI set dedupingInterval: 0 kecuali benar-benar perlu
        }
    );

    const loading = !data || (!data.length && !error); // loading hanya saat pertama
    const quotes = data ?? [];

    const scrollLeft = () => containerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    const scrollRight = () => containerRef.current?.scrollBy({ left: 300, behavior: "smooth" });

    if (loading) return <p className="text-white">Loading market…</p>;
    if (error) return <p className="text-red-400">Gagal memuat market.</p>;

    return (
        <div className="relative w-full">
            {/* tombol panah */}
            <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                aria-label="Scroll kiri"
            >
                <FaChevronLeft />
            </button>
            <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                aria-label="Scroll kanan"
            >
                <FaChevronRight />
            </button>

            <div className="overflow-x-auto scrollbar-hide" ref={containerRef}>
                <div className="flex gap-4 py-2">
                    {quotes.map((q) => (
                        <MarketUpdateCard key={q.symbol} quote={q} />
                    ))}
                    {quotes.length === 0 && (
                        <div className="text-gray-300 px-4 py-2">Tidak ada data market.</div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}
