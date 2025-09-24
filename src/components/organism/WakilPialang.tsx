import useSWR from "swr";
import Image from "next/image";

type WakilPialang = {
    id: number;
    image: string;       // path relatif dari backend (contoh: "uploads/wakil-pialang/abc.jpg")
    nomor_id: string;
    nama: string;
    status: "Aktif" | "Non-Aktif" | string; // jaga-jaga jika casing beda
    created_at?: string;
    updated_at?: string;
};

// fetcher sederhana
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
        return json.data as WakilPialang[]; // hanya ambil bagian data
    });

function statusClass(status: string) {
    const s = status.trim().toLowerCase();
    if (s === "aktif") return "text-green-400";
    if (s === "non-aktif" || s === "nonaktif" || s === "non aktif") return "text-red-400";
    return "text-yellow-400";
}

export default function WakilPialangSection() {
    const { data, error, isLoading } = useSWR<WakilPialang[]>("https://vellorist.biz.id/api/v1/wakil-pialang", fetcher);

    return (
        <section className="text-white space-y-7 mb-5" data-aos="fade-up">
            <div className="text-center mx-auto max-w-xl px-4">
                <p className="font-bold mb-2 uppercase text-yellow-500 text-sm md:text-base">
                    Wakil Pialang
                </p>
                <h2 className="font-bold mb-4 uppercase text-lg md:text-2xl">
                    Semua ahli berpengalaman ada di sini
                </h2>
            </div>

            {/* State */}
            {isLoading && (
                <div className="px-4">
                    <div className="rounded-xl bg-[#1e1e1e] p-6 text-center text-gray-300">
                        Memuat data…
                    </div>
                </div>
            )}

            {error && (
                <div className="px-4">
                    <div className="rounded-xl bg-red-900/40 border border-red-700 p-6 text-center">
                        Gagal memuat data. Coba refresh halaman.
                    </div>
                </div>
            )}

            {/* Grid */}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
                    {(data ?? []).map((pialang) => (
                        <div
                            key={pialang.id}
                            className="group rounded-xl overflow-hidden bg-[#1e1e1e] text-center shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
                        >
                            {/* Foto */}
                            <div className="relative w-full h-48">
                                <Image
                                    src={pialang.image ? `https://vellorist.biz.id/${pialang.image}` : "/images/placeholder.jpg"}
                                    alt={pialang.nama}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority={false}
                                />
                            </div>

                            {/* Konten */}
                            <div className="px-6 py-5 space-y-1">
                                <p className="text-gray-300 font-medium text-sm tracking-wide">
                                    {pialang.nama}
                                </p>
                                <p className="text-white font-bold text-base font-mono">
                                    {pialang.nomor_id}
                                </p>
                                <p className={`font-semibold text-sm ${statusClass(pialang.status)}`}>
                                    {pialang.status?.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Fallback jika kosong */}
                    {data && data.length === 0 && (
                        <div className="col-span-full">
                            <div className="rounded-xl bg-[#1e1e1e] p-6 text-center text-gray-300">
                                Belum ada data wakil pialang.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
