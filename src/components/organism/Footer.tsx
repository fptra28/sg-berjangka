import React from "react";

type LinkItem = {
    label: string;
    href: string;
};

type CategoryItem = {
    category: string;
    children: LinkItem[];
};

type DropdownItem = LinkItem | CategoryItem;

type MenuItem = {
    label: string;
    key: string;
    dropdown?: DropdownItem[];
};

export default function Footer() {
    const menuItems: MenuItem[] = [
        {
            label: "Produk",
            key: "produk",
            dropdown: [
                { label: "Multilateral (JFX)", href: "/multilateral" },
                { label: "Bilateral (SPA)", href: "/bilateral" },
            ],
        },
        {
            label: "News",
            key: "news",
            dropdown: [
                {
                    category: "Market",
                    children: [
                        { label: "Index", href: "/indexNews" },
                        { label: "Commodity", href: "/commodityNews" },
                        { label: "Currencies", href: "/currenciesNews" },
                    ],
                },
                {
                    category: "Economic",
                    children: [
                        {
                            label: "Global & Economy",
                            href: "/economicNews",
                        },
                    ],
                },
            ],
        },
        {
            label: "Analysis",
            key: "analysis",
            dropdown: [
                { label: "Market Analysis", href: "/analisisMarket" },
                { label: "Economic Calendar", href: "/analisis/kalender-ekonomi" },
                { label: "Analysis & Opinion", href: "/analisisOpini" },
                { label: "Pivot & Fibonacci", href: "/analisis/pivot-fibonacci" },
            ],
        },
    ];

    return (
        <footer className="w-full bg-black text-gray-300 border-t border-zinc-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Logo & Deskripsi */}
                    <div>
                        <img
                            src="/assets/Logo Solid-Calibri-Fix-2.png"
                            alt="Logo"
                            className="h-12 mb-4"
                        />
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Broker resmi yang diawasi oleh Bappebti dan Bursa
                            Berjangka.
                        </p>
                    </div>

                    {/* Menu Items */}
                    {menuItems.map((menu, index) => (
                        <div key={index}>
                            <h5 className="font-semibold mb-4 text-white uppercase tracking-wide">
                                {menu.label}
                            </h5>

                            {Array.isArray(menu.dropdown) &&
                                menu.dropdown.length > 0 && (
                                    <ul className="space-y-2">
                                        {menu.dropdown.map((item, idx) => {
                                            if ("category" in item) {
                                                return (
                                                    <li key={idx}>
                                                        <span className="block text-yellow-500 font-medium mb-1">
                                                            {item.category}
                                                        </span>
                                                        <ul className="space-y-1 ml-2">
                                                            {item.children.map(
                                                                (child, childIdx) => (
                                                                    <li key={childIdx}>
                                                                        <a
                                                                            href={child.href}
                                                                            className="hover:text-yellow-500 transition-colors duration-200 text-sm"
                                                                        >
                                                                            {
                                                                                child.label
                                                                            }
                                                                        </a>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </li>
                                                );
                                            }

                                            return (
                                                <li key={idx}>
                                                    <a
                                                        href={item.href}
                                                        className="hover:text-yellow-500 transition-colors duration-200 text-sm"
                                                    >
                                                        {item.label}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
                © {new Date().getFullYear()} Solid Gold Berjangka. All rights reserved.
            </div>
        </footer>
    );
}
