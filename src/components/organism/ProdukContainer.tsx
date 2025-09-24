"use client";

import { useEffect, useMemo, useState } from "react";
import ProdukCard from "../moleculs/ProdukCard";

type Produk = {
    id: number;
    nama_produk: string;
    slug: string;
    deskripsi_produk: string;
    specs?: string;
    image?: string;
    kategori?: string; // "JFX" | "SPA"
    created_at?: string;
    updated_at?: string;
};

interface ProdukContainerProps {
    kategoriProduk: "multilateral" | "bilateral";
}

export default function ProdukContainer({ kategoriProduk }: ProdukContainerProps) {
    const [produk, setProduk] = useState<Produk[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const targetKategori = useMemo<"JFX" | "SPA">(
        () => (kategoriProduk === "multilateral" ? "JFX" : "SPA"),
        [kategoriProduk]
    );

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch("https://vellorist.biz.id/api/v1/produk", {
                    cache: "no-store",
                    headers: {
                        "Authorization": "Bearer SGB-c7b0604664fd48d9",
                        "Accept": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Gagal memuat data produk");

                // JSON dari server
                const json = await res.json();
                // ambil array data
                const data: Produk[] = json.data;

                if (!Array.isArray(data)) throw new Error("Format data tidak valid");
                if (!isMounted) return;

                const filtered = data.filter(
                    (p) => (p.kategori || "").toUpperCase() === targetKategori
                );
                setProduk(filtered);
            } catch (e: any) {
                if (!isMounted) return;
                setError(e?.message ?? "Terjadi kesalahan saat memuat data");
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [targetKategori]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-neutral-800 rounded-lg shadow animate-pulse">
                        <div className="w-full h-48 bg-neutral-700 rounded-t-lg" />
                        <div className="p-4">
                            <div className="h-6 bg-neutral-700 rounded w-2/3 mb-3" />
                            <div className="h-4 bg-neutral-700 rounded w-full mb-2" />
                            <div className="h-4 bg-neutral-700 rounded w-5/6 mb-4" />
                            <div className="h-10 bg-neutral-700 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-400 bg-neutral-900 border border-red-800 rounded p-4">
                {error}
            </div>
        );
    }

    if (!produk.length) {
        return (
            <div className="text-gray-300 bg-neutral-900 border border-neutral-700 rounded p-4">
                Tidak ada produk untuk kategori {targetKategori}.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
            {produk.map((p) => (
                <ProdukCard
                    key={p.id}
                    title={p.nama_produk}
                    description={p.deskripsi_produk}
                    slug={p.slug}
                    imagePath={p.image}
                    href={`/produk/${kategoriProduk}/${p.slug}`} // <<— PENTING
                />
            ))}
        </div>
    );
}
