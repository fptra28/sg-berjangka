// pages/produk/[kategoriProduk]/[slug]/index.tsx
import type { GetServerSideProps } from "next";
import PageTemplates from "@/components/templates/PageTemplates";
import Header from "@/components/moleculs/Header";
import ProdukDetail from "@/components/organism/ProdukDetail"; // ganti ke 'organisms' kalau folder kamu plural

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

type PageProps = {
    kategoriProduk: "multilateral" | "bilateral";
    produk: Produk;
};

export default function ProdukDetailPage({ kategoriProduk, produk }: PageProps) {
    const isMultilateral = kategoriProduk === "multilateral";
    const headerTitle = produk?.nama_produk ?? "Detail Produk";
    const subheaderTitle = isMultilateral
        ? "Produk Multilateral (JFX)"
        : "Produk Bilateral (SPA)";

    return (
        <PageTemplates title={headerTitle}>
            <Header title={headerTitle} subtitle={subheaderTitle} />
            <ProdukDetail data={produk} kategoriProduk={kategoriProduk} />
        </PageTemplates>
    );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
    const rawKategori = ctx.params?.kategoriProduk;
    const rawSlug = ctx.params?.slug;

    const kategoriProduk = String(Array.isArray(rawKategori) ? rawKategori[0] : rawKategori)
        .toLowerCase()
        .trim();
    const slug = String(Array.isArray(rawSlug) ? rawSlug[0] : rawSlug).toLowerCase().trim();

    if (kategoriProduk !== "multilateral" && kategoriProduk !== "bilateral") {
        return { notFound: true };
    }

    const expectedKategori = kategoriProduk === "multilateral" ? "JFX" : "SPA";

    try {
        const host = ctx.req.headers.host!;
        const protocol = host.startsWith("localhost") ? "http" : "https";

        const res = await fetch(`https://vellorist.biz.id/api/v1/produk`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer SGB-c7b0604664fd48d9", // 🔹 tambahkan token
            },
        });

        if (!res.ok) return { notFound: true };

        const json = await res.json();
        const list: Produk[] = json.data; // 🔹 ambil data dari json.data

        if (!Array.isArray(list)) return { notFound: true };

        const produk = list.find(
            (p) =>
                p.slug?.toLowerCase() === slug &&
                (p.kategori || "").toUpperCase() === expectedKategori
        );
        if (!produk) return { notFound: true };

        return {
            props: {
                kategoriProduk: kategoriProduk as "multilateral" | "bilateral",
                produk,
            },
        };
    } catch {
        return { notFound: true };
    }
};

