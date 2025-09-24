import { useRouter } from "next/router";

export default function LanguageToggle() {
    const router = useRouter();

    const toggleLang = () => {
        const nextLang = router.pathname.startsWith("/en") ? "/id" : "/en";
        router.push(nextLang);
    };

    return (
        <button onClick={toggleLang}>
            Toggle Language
        </button>
    );
}
