import { useRouter } from "next/router";
import NewsContainer from "@/components/organism/NewsContainer";

export default function DynamicPage() {
    const router = useRouter();
    const { slug } = router.query;

    // slug bisa array atau string
    let kategoriSlug = "indexNews"; // default
    if (Array.isArray(slug)) {
        kategoriSlug = slug[0]; // misal ambil segmen pertama
    } else if (typeof slug === "string") {
        kategoriSlug = slug;
    }

    return <NewsContainer kategoriSlug={kategoriSlug} />;
}
