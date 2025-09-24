import Link from "next/link";
import Image from "next/image";
import MiniHeader from "../atoms/MiniHeader";

type LogoItem = {
    src: string;
    alt: string;
    href?: string;
};

function isValidHref(href?: string): boolean {
    return !!href && href.trim() !== "";
}

function isExternal(href: string): boolean {
    return /^https?:\/\//i.test(href);
}

const LogoGrid = ({
    title,
    items,
    Aos,
    AosHeader,
    className = "space-y-5",
    gridClassName = "grid grid-cols-2 gap-5",
}: {
    title: string;
    Aos: string;
    AosHeader: string;
    items: LogoItem[];
    className?: string;
    gridClassName?: string;
}) => {
    return (
        <div className={className}>
            <div className="flex justify-center w-full" data-aos={AosHeader}>
                <MiniHeader title={title} />
            </div>
            <div className={gridClassName} data-aos={Aos}>
                {items.map((item, index) => {
                    const href = item.href?.trim();
                    const key = `${item.alt}-${item.src}`;

                    const cardContent = (
                        <div className="h-full flex items-center justify-center p-4 bg-neutral-800 rounded hover:shadow hover:shadow-yellow-500 transition duration-300">
                            <img
                                src={encodeURI(item.src)}
                                alt={item.alt}
                                className="max-h-[80px] w-auto object-contain"
                            />
                        </div>
                    );

                    // No href → show just the card
                    if (!isValidHref(href)) {
                        return <div key={key}>{cardContent}</div>;
                    }

                    // External link
                    if (isExternal(href!)) {
                        return (
                            <a
                                key={key}
                                href={href!}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={item.alt}
                            >
                                {cardContent}
                            </a>
                        );
                    }

                    // Internal link
                    return (
                        <Link key={key} href={href!} aria-label={item.alt}>
                            {cardContent}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default function Watcher() {
    const logoPengawas: LogoItem[] = [
        {
            src: "/assets/bappeti.png",
            alt: "Logo JFX",
            href: "https://bappebti.go.id/pialang_berjangka/detail/049",
        },
        {
            src: "/assets/OJK_Logo.png",
            alt: "Logo OJK",
            href: "https://www.ojk.go.id/id/Default.aspx",
        },
        {
            src: "/assets/Logo-BI.png",
            alt: "Logo Bank Indonesia",
            href: "https://www.bi.go.id/id/default.aspx",
        },
        { src: "/assets/logo TSI.png", alt: "Logo TSI", href: "" },
    ];

    const logoMember: LogoItem[] = [
        {
            src: "/assets/logo JFX.png",
            alt: "Logo JFX",
            href: "https://www.jfx.co.id/MarketMaker/market_maker/Pialang",
        },
        {
            src: "/assets/logo KBI.png",
            alt: "Logo KBI",
            href: "http://ptkbi.com/our-partner/perdagangan-berjangka-komoditi",
        },
        {
            src: "/assets/aspebtindo.png",
            alt: "Aspebtindo",
            href: "",
        },
    ];

    return (
        <div className="border-y border-white/25 space-y-10 py-10 px-5" data-aos="fade-left">
            <LogoGrid title="BERIZIN DAN DIAWASI" items={logoPengawas} gridClassName="grid grid-cols-2 md:grid-cols-4 gap-5" Aos="fade-right" AosHeader="fade-left" />
            <LogoGrid title="KEANGGOTAAN DARI" items={logoMember} gridClassName="grid grid-cols-2 md:grid-cols-3 gap-5" Aos="fade-left" AosHeader="fade-right" />
        </div>
    );
}
