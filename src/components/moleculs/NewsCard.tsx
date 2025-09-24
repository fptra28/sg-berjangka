"use client";

import Link from "next/link";
import Image from "next/image";

interface NewsCardProps {
    title: string;
    category: string;
    description?: string;
    image?: string;
    href: string; // <- WAJIB
}

export default function NewsCard({
    title,
    category,
    description = "Tidak ada deskripsi.",
    image,
    href,
}: NewsCardProps) {
    return (
        <Link href={href} prefetch={false} className="block h-full">
            <article className="bg-neutral-800 hover:bg-neutral-900 h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <div className="relative w-full h-40 bg-neutral-700">
                    <Image
                        src={image || "/placeholder.jpg"}
                        alt={title || "Berita"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        priority={false}
                    />
                </div>
                <div className="p-4 flex flex-col h-full">
                    <div>
                        <h2 className="text-sm uppercase font-semibold text-yellow-500 tracking-wide">
                            {category || "-"}
                        </h2>
                        <h3 className="text-lg sm:text-xl line-clamp-2 font-bold text-white mb-2">
                            {title}
                        </h3>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base line-clamp-3">
                        {description}
                    </p>
                </div>
            </article>
        </Link>
    );
}
