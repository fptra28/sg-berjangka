// src/components/organism/HistoricalDataTable.tsx
"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";

type Row = {
    id: number;
    tanggal: string;
    open: string;
    high: string;
    low: string;
    close: string;
    category: string;
    created_at?: string;
    updated_at?: string;
};

const fetcher = (url: string) =>
    fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`);
        return r.json();
    });

function pickArray<T = unknown>(raw: any): T[] {
    if (Array.isArray(raw)) return raw as T[];
    if (raw && Array.isArray(raw.data)) return raw.data as T[];
    return [];
}

const numFmt = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFmt = (s?: string) => {
    if (!s) return "-";
    const d = new Date(s);
    return Number.isNaN(d.getTime())
        ? s
        : d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "2-digit" });
};

// Tanpa "All"
const FILTERS = [
    "LGD Daily",
    "LSI",
    "HSI Daily",
    "SNI Daily",
    "AUD/USD",
    "EUR/USD",
    "GBP/USD",
    "USD/CHF",
    "USD/JPY",
] as const;
type FilterType = (typeof FILTERS)[number];

// Alias supaya "LGS Daily" tetap memunculkan "LGD Daily"
const ALIAS: Record<string, string> = {
    "lgs daily": "lgd daily",
};

export default function HistoricalDataTable() {
    // Default langsung LGD Daily
    const DEFAULT_FILTER: FilterType = "LGD Daily";
    const [activeFilter, setActiveFilter] = useState<FilterType>(DEFAULT_FILTER);

    const { data, error, isLoading, mutate } = useSWR<unknown>("https://portalnews.newsmaker.id/api/pivot-history", fetcher, {
        refreshInterval: 60_000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        keepPreviousData: true,
    });

    const rows: Row[] = useMemo(() => {
        const arr = pickArray<Row>(data);
        return arr
            .slice()
            .sort((a, b) => {
                const ta = Date.parse(a.tanggal ?? "");
                const tb = Date.parse(b.tanggal ?? "");
                return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
            });
    }, [data]);

    const filteredRows = useMemo(() => {
        const targetRaw = activeFilter.toLowerCase();
        const target = (ALIAS[targetRaw] ?? targetRaw).trim();
        return rows.filter((r) => (r.category || "").toLowerCase().trim() === target);
    }, [rows, activeFilter]);

    return (
        <div className="w-full">
            {/* Header & Controls */}
            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-white font-semibold text-lg">Historical Data</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => mutate()}
                        className="px-3 py-1.5 text-sm rounded bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        aria-label="Refresh data"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filter chips (tanpa All) */}
            <div className="mb-4 overflow-x-auto">
                <div className="inline-flex gap-2 pr-2">
                    {FILTERS.map((f) => {
                        const active = activeFilter === f;
                        return (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-full border text-sm transition-colors whitespace-nowrap cursor-pointer ${active
                                    ? "bg-yellow-500 border-yellow-500 text-black"
                                    : "bg-transparent border-neutral-600 text-neutral-200 hover:bg-neutral-800"
                                    }`}
                            >
                                {f}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto rounded border border-neutral-800">
                <table className="min-w-[720px] w-full text-sm">
                    <thead className="bg-neutral-900/70 text-neutral-300">
                        <tr>
                            <th className="px-3 py-2 text-left">Tanggal</th>
                            <th className="px-3 py-2 text-right">Open</th>
                            <th className="px-3 py-2 text-right">High</th>
                            <th className="px-3 py-2 text-right">Low</th>
                            <th className="px-3 py-2 text-right">Close</th>
                        </tr>
                    </thead>

                    <tbody className="bg-neutral-900/40 text-white">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={`sk-${i}`} className="animate-pulse">
                                    <td className="px-3 py-2"><div className="h-4 w-24 bg-neutral-700 rounded" /></td>
                                    <td className="px-3 py-2 text-right"><div className="h-4 w-16 bg-neutral-700 rounded inline-block" /></td>
                                    <td className="px-3 py-2 text-right"><div className="h-4 w-16 bg-neutral-700 rounded inline-block" /></td>
                                    <td className="px-3 py-2 text-right"><div className="h-4 w-16 bg-neutral-700 rounded inline-block" /></td>
                                    <td className="px-3 py-2 text-right"><div className="h-4 w-16 bg-neutral-700 rounded inline-block" /></td>
                                </tr>
                            ))
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="px-3 py-6 text-center text-red-400">
                                    Gagal memuat data.
                                </td>
                            </tr>
                        ) : filteredRows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-3 py-6 text-center text-neutral-300">
                                    Tidak ada data pada kategori <b>{activeFilter}</b>.
                                </td>
                            </tr>
                        ) : (
                            filteredRows.map((r) => (
                                <tr key={r.id} className="border-t border-neutral-800 hover:bg-neutral-800/40">
                                    <td className="px-3 py-2">{dateFmt(r.tanggal)}</td>
                                    <td className="px-3 py-2 text-right">{numFmt.format(parseFloat(r.open))}</td>
                                    <td className="px-3 py-2 text-right">{numFmt.format(parseFloat(r.high))}</td>
                                    <td className="px-3 py-2 text-right">{numFmt.format(parseFloat(r.low))}</td>
                                    <td className="px-3 py-2 text-right">{numFmt.format(parseFloat(r.close))}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 text-xs text-neutral-400">
                Menampilkan kategori: <strong className="text-neutral-200">{activeFilter}</strong>
            </div>
        </div>
    );
}
