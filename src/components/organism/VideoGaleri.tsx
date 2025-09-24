"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import TikTokEmbed from "../moleculs/TikTokEmbed";

/* ========= Types ========= */
type ApiLegalitas = {
    id: number;
    title: string;
    image: string;
    created_at?: string;
    updated_at?: string;
};
type LegalitasItem = { title: string; file: string };

type ApiVideo = {
    id: number;
    title: string;
    image?: string | null;
    embed_code: string;
    created_at?: string;
    updated_at?: string;
};
type VideoItem = { id: number; title: string; thumb: string; iframeHtml: string };

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

/* ========= Utils ========= */
const fetcher = (url: string) => {
    return fetch(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer SGB-c7b0604664fd48d9`,
        },
        cache: "no-store",
    }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`);
        return r.json();
    });
};

function mediaUrl(p?: string | null) {
    if (!p) return "/placeholder.jpg";
    if (/^https?:\/\//i.test(p)) return p;
    const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://vellorist.biz.id";
    return `${base}/${String(p).replace(/^\/+/, "")}`;
}

function extractIframeSrc(html?: string): string | undefined {
    if (!html) return;
    const noScript = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    const m = noScript.match(/<iframe[^>]*\s+src=["']([^"']+)["'][^>]*>/i);
    return m?.[1];
}

export default function VideoGaleri() {
    /* ====== LEGALITAS ====== */
    const {
        data: legalitasData,
        error: legalitasErr,
        isLoading: legalitasLoading,
    } = useSWR<ApiResponse<ApiLegalitas[]>>("https://vellorist.biz.id/api/v1/legalitas", fetcher, {
        refreshInterval: 60_000,
    });

    const legalitasList: LegalitasItem[] = useMemo(() => {
        if (Array.isArray(legalitasData?.data)) {
            return legalitasData.data.map((it) => ({
                title: it.title,
                file: mediaUrl(it.image),
            }));
        }
        return [];
    }, [legalitasData]);

    const [legalitasIndex, setLegalitasIndex] = useState(0);
    useEffect(() => setLegalitasIndex(0), [legalitasList.length]);

    useEffect(() => {
        if (legalitasList.length < 2) return;
        const itv = setInterval(() => setLegalitasIndex((p) => (p + 1) % legalitasList.length), 5000);
        return () => clearInterval(itv);
    }, [legalitasList.length]);

    const prevLegalitas = () =>
        setLegalitasIndex((p) => (legalitasList.length ? (p === 0 ? legalitasList.length - 1 : p - 1) : 0));
    const nextLegalitas = () =>
        setLegalitasIndex((p) => (legalitasList.length ? (p === legalitasList.length - 1 ? 0 : p + 1) : 0));
    const currentLegalitas = legalitasList[legalitasIndex];

    /* ====== VIDEO ====== */
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    const {
        data: videoData,
        error: videoErr,
        isLoading: videoLoading,
    } = useSWR<ApiResponse<ApiVideo[]>>("https://vellorist.biz.id/api/v1/video", fetcher, {
        refreshInterval: videoModalOpen ? 0 : 60_000,
    });

    const videoList: VideoItem[] = useMemo(() => {
        if (Array.isArray(videoData?.data)) {
            return videoData.data.map((v) => ({
                id: v.id,
                title: v.title,
                thumb: mediaUrl(v.image),
                iframeHtml: v.embed_code,
            }));
        }
        return [];
    }, [videoData]);

    const [videoIndex, setVideoIndex] = useState(0);
    useEffect(() => setVideoIndex(0), [videoList.length]);

    useEffect(() => {
        if (videoList.length < 2 || videoModalOpen) return;
        const itv = setInterval(() => setVideoIndex((p) => (p + 1) % videoList.length), 5000);
        return () => clearInterval(itv);
    }, [videoList.length, videoModalOpen]);

    const prevVideo = () =>
        setVideoIndex((p) => (videoList.length ? (p === 0 ? videoList.length - 1 : p - 1) : 0));
    const nextVideo = () =>
        setVideoIndex((p) => (videoList.length ? (p === videoList.length - 1 ? 0 : p + 1) : 0));
    const currentVideo = videoList[videoIndex];

    /* ====== Modal Legalitas ====== */
    const [legalitasModalOpen, setLegalitasModalOpen] = useState(false);
    const [activeLegalitas, setActiveLegalitas] = useState<LegalitasItem | null>(null);
    const openLegalitasModal = useCallback((img: LegalitasItem) => {
        setActiveLegalitas(img);
        setLegalitasModalOpen(true);
    }, []);
    const closeLegalitasModal = useCallback(() => {
        setLegalitasModalOpen(false);
        setActiveLegalitas(null);
    }, []);
    useEffect(() => {
        if (!legalitasModalOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeLegalitasModal();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [legalitasModalOpen, closeLegalitasModal]);

    /* ====== Modal Video ====== */
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
    const openVideoModal = useCallback((v: VideoItem) => {
        setActiveVideo(v);
        setVideoModalOpen(true);
    }, []);
    const closeVideoModal = useCallback(() => {
        setVideoModalOpen(false);
        setActiveVideo(null);
    }, []);
    useEffect(() => {
        if (!videoModalOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeVideoModal();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [videoModalOpen, closeVideoModal]);

    const activeSrc = useMemo(() => extractIframeSrc(activeVideo?.iframeHtml), [activeVideo?.id]);

    // TikTok (contoh)
    const tiktokId = "7553316247002385676";

    return (
        <div className="flex flex-col lg:flex-row gap-5 p-4">
            {/* TikTok */}
            <section className="flex flex-col items-center text-center space-y-5 lg:w-1/3" data-aos="fade-right">
                <div className="bg-neutral-800 px-4 py-2 rounded font-semibold text-yellow-500 w-fit">Video TikTok</div>
                <TikTokEmbed videoId={tiktokId} />
            </section>

            {/* Legalitas & Video */}
            <section className="flex flex-col lg:w-2/3 space-y-10">
                {/* LEGALITAS */}
                <div className="flex flex-col items-center text-center space-y-5" data-aos="fade-left">
                    <div className="bg-neutral-800 px-4 py-2 rounded font-semibold text-yellow-500 w-fit">Legalitas</div>
                    <div className="relative w-full max-w-3xl overflow-hidden rounded-lg shadow-lg min-h-[16rem] bg-neutral-900">
                        {legalitasLoading ? (
                            <div className="w-full h-full animate-pulse bg-neutral-800" />
                        ) : legalitasErr ? (
                            <div className="p-6 text-red-400">Gagal memuat legalitas.</div>
                        ) : legalitasList.length === 0 ? (
                            <div className="p-6 text-neutral-300">Belum ada data legalitas.</div>
                        ) : (
                            <>
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={legalitasIndex}
                                        src={currentLegalitas.file}
                                        alt={currentLegalitas.title}
                                        className="w-full h-82 object-cover rounded-lg bg-neutral-800 cursor-pointer"
                                        onClick={() => openLegalitasModal(currentLegalitas)}
                                        initial={{ x: 300, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -300, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                    />
                                </AnimatePresence>
                                {legalitasList.length > 1 && (
                                    <>
                                        <button onClick={prevLegalitas} className="absolute top-1/2 left-2">❮</button>
                                        <button onClick={nextLegalitas} className="absolute top-1/2 right-2">❯</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* VIDEO */}
                <div className="flex flex-col items-center text-center space-y-5" data-aos="fade-left">
                    <div className="bg-neutral-800 px-4 py-2 rounded font-semibold text-yellow-500 w-fit">Video Edukasi</div>
                    <div className="relative w-full max-w-3xl overflow-hidden rounded-lg shadow-lg min-h-[16rem] bg-neutral-900">
                        {videoLoading ? (
                            <div className="w-full h-full animate-pulse bg-neutral-800" />
                        ) : videoErr ? (
                            <div className="p-6 text-red-400">Gagal memuat video.</div>
                        ) : videoList.length === 0 ? (
                            <div className="p-6 text-neutral-300">Belum ada data video.</div>
                        ) : (
                            <>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={videoIndex}
                                        className="relative"
                                        initial={{ x: 300, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -300, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <img
                                            src={currentVideo.thumb}
                                            alt={currentVideo.title}
                                            className="w-full h-82 object-cover rounded-lg bg-neutral-900 cursor-pointer"
                                            onClick={() => openVideoModal(currentVideo)}
                                            loading="lazy"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                                {videoList.length > 1 && (
                                    <>
                                        <button onClick={prevVideo} className="absolute top-1/2 left-2">❮</button>
                                        <button onClick={nextVideo} className="absolute top-1/2 right-2">❯</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal Legalitas */}
            {legalitasModalOpen && activeLegalitas && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-[1px] flex justify-center items-center z-50 p-4"
                    onClick={closeLegalitasModal}
                >
                    <div
                        className="bg-neutral-900 relative p-3 sm:p-4 rounded-xl shadow-2xl w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeLegalitasModal}
                            className="absolute right-3 top-3 px-3 py-1 text-sm rounded-full bg-neutral-700 text-white hover:bg-neutral-800 transition cursor-pointer"
                        >
                            Close
                        </button>

                        <div className="w-full max-h-[85vh] overflow-auto flex items-center justify-center">
                            <img src={activeLegalitas.file} alt={activeLegalitas.title} className="max-h-[80vh] w-auto h-auto rounded-lg" />
                        </div>

                        <div className="mt-3 text-white font-medium">{activeLegalitas.title}</div>
                    </div>
                </div>
            )}

            {/* Modal Video */}
            {videoModalOpen && activeVideo && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-[1px] flex justify-center items-center z-50 p-4"
                    onClick={closeVideoModal}
                >
                    <div
                        className="bg-neutral-900 relative p-3 sm:p-4 rounded-xl shadow-2xl w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeVideoModal}
                            className="absolute right-3 top-3 px-3 py-1 text-sm rounded-full bg-neutral-700 text-white hover:bg-neutral-800 transition cursor-pointer"
                        >
                            Close
                        </button>

                        <div className="w-full h-[65vh] bg-black rounded-lg overflow-hidden">
                            {activeSrc ? (
                                <iframe
                                    key={activeVideo.id}
                                    src={activeSrc}
                                    title={activeVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                    className="w-full h-full rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                    Embed tidak tersedia
                                </div>
                            )}
                        </div>

                        <div className="mt-3 text-white font-medium">{activeVideo.title}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
