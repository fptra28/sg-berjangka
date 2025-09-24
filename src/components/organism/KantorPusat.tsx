"use client";

import useSWR from "swr";
import { useEffect } from "react";
import AOS from "aos";

type Setting = {
    id: number;
    web_title: string;
    web_description: string;
    address: string;
    maps_link?: string | null;
    phone: string;
    fax: string;
    email: string;
    created_at?: string;
    updated_at?: string;
};

const fetcher = (url: string) =>
    fetch(url, {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer SGB-c7b0604664fd48d9",
        },
        cache: "no-store",
    }).then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        return json.data as Setting[]; // hanya ambil bagian data
    });

function toEmbedUrl(mapsLink?: string | null, address?: string) {
    if (mapsLink && /google\.[^/]+\/maps/i.test(mapsLink)) {
        try {
            const u = new URL(mapsLink);
            if (u.pathname.startsWith("/maps")) {
                u.pathname = "/maps/embed";
                return u.toString();
            }
        } catch { }
    }
    const q = encodeURIComponent(address || "");
    return `https://www.google.com/maps?q=${q}&output=embed`;
}

export default function KantorPusat() {
    const { data, error, isLoading } = useSWR<Setting[]>("https://vellorist.biz.id/api/v1/setting", fetcher, {
        refreshInterval: 60_000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        keepPreviousData: true,
        dedupingInterval: 10_000,
    });

    // ✅ Setelah data berubah dari loading → ready, paksa AOS re-scan
    useEffect(() => {
        if (!isLoading) {
            AOS.refresh(); // atau AOS.refreshHard();
        }
    }, [isLoading, data, error]);

    const setting = data?.[0];
    const address = setting?.address || "";
    const mapsHref = setting?.maps_link || undefined;
    const iframeSrc = toEmbedUrl(mapsHref, address);

    return (
        <section className="text-white py-16">
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
                {/* Peta di kiri (selalu ter-mount) */}
                <div className="md:w-1/2 w-full h-80 md:h-[450px]">
                    {isLoading ? (
                        <div className="w-full h-full rounded-lg bg-neutral-800 animate-pulse" />
                    ) : error ? (
                        <div className="w-full h-full rounded-lg bg-neutral-900 flex items-center justify-center text-red-400">
                            Gagal memuat peta.
                        </div>
                    ) : (
                        <iframe
                            src={iframeSrc}
                            className="w-full h-full border-0 rounded-lg"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    )}
                </div>

                {/* Teks di kanan — container ini SELALU ada & punya data-aos */}
                <div
                    className="md:w-1/2 w-full text-center md:text-left"
                    data-aos="fade-left"
                    data-aos-once="true"
                >
                    {isLoading ? (
                        <div>
                            <div className="h-5 w-40 bg-neutral-800 rounded animate-pulse mb-3" />
                            <div className="h-8 w-64 bg-neutral-800 rounded animate-pulse mb-5" />
                            <div className="space-y-4">
                                <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-neutral-800 rounded animate-pulse" />
                                <div className="h-4 w-3/5 bg-neutral-800 rounded animate-pulse" />
                            </div>
                        </div>
                    ) : error ? (
                        <p className="text-red-400">Gagal memuat data setting.</p>
                    ) : (
                        <>
                            <h2 className="font-bold mb-2 uppercase text-yellow-500">Hubungi Kami</h2>
                            <h1 className="font-bold mb-4 uppercase text-3xl md:text-4xl">
                                {setting?.web_title || "Kantor Pusat"}
                            </h1>

                            <div className="space-y-5">
                                <div>
                                    {address ? (
                                        <a
                                            href={mapsHref ?? "#"}
                                            target={mapsHref ? "_blank" : undefined}
                                            rel={mapsHref ? "noopener noreferrer" : undefined}
                                            className={`text-gray-300 hover:text-yellow-500 transition ${mapsHref ? "" : "pointer-events-none cursor-default"
                                                }`}
                                        >
                                            {address}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Alamat belum tersedia</span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-5">
                                    <p>
                                        <strong>FAX : </strong>
                                        {setting?.fax || "-"}
                                    </p>
                                    <span>|</span>
                                    <p>
                                        <strong>Telp : </strong>
                                        {setting?.phone || "-"}
                                    </p>
                                </div>

                                <p>
                                    Alamat email:{" "}
                                    {setting?.email ? (
                                        <a
                                            href={`mailto:${setting.email}`}
                                            className="text-gray-300 hover:text-yellow-500 transition"
                                        >
                                            {setting.email}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
