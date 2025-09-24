// pages/produk/[kategoriProduk]/index.tsx

import Header from "@/components/moleculs/Header";
import ProdukContainer from "@/components/organism/ProdukContainer";
import PageTemplates from "@/components/templates/PageTemplates";
import type { GetServerSideProps } from "next";

type PageProps = {
    kategoriProduk: "multilateral" | "bilateral";
};

export default function ProdukByKategoriPage({ kategoriProduk }: PageProps) {
    const isMultilateral = kategoriProduk === "multilateral";
    const pageTitle = isMultilateral ? "Produk JFX" : "Produk SPA";
    const headerTitle = isMultilateral
        ? "Produk Multilateral (JFX)"
        : "Produk Bilateral (SPA)";

    return (
        <PageTemplates title={pageTitle}>
            <Header title={headerTitle} subtitle="PT. Solid Gold Berjangka" />
            <ProdukContainer kategoriProduk={kategoriProduk} />
        </PageTemplates>
    );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
    const raw = ctx.params?.kategoriProduk;
    const slug = String(Array.isArray(raw) ? raw[0] : raw).toLowerCase().trim();

    if (slug !== "multilateral" && slug !== "bilateral") {
        return { notFound: true };
    }

    return { props: { kategoriProduk: slug as "multilateral" | "bilateral" } };
};
