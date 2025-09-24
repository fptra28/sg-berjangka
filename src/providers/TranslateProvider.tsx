// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";

// interface TranslateContextType {
//     lang: "id" | "en";
//     toggleLang: () => void;
//     translateText: (text: string) => Promise<string>;
// }

// const TranslateContext = createContext<TranslateContextType | undefined>(undefined);

// export function TranslateProvider({ children }: { children: ReactNode }) {
//     const [lang, setLang] = useState<"id" | "en">("id");

//     const toggleLang = () => setLang(prev => (prev === "id" ? "en" : "id"));

//     const translateText = async (text: string) => {
//         if (lang === "id") return text; // default bahasa Indonesia

//         try {
//             const res = await fetch("https://libretranslate.de/translate", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     q: text,
//                     source: "id",
//                     target: lang,
//                     format: "text",
//                 }),
//             });
//             const data = await res.json();
//             return data.translatedText;
//         } catch (err) {
//             console.error(err);
//             return text;
//         }
//     };

//     return (
//         <TranslateContext.Provider value={{ lang, toggleLang, translateText }}>
//             {children}
//         </TranslateContext.Provider>
//     );
// }

// export const useTranslate = () => {
//     const context = useContext(TranslateContext);
//     if (!context) throw new Error("useTranslate must be used within TranslateProvider");
//     return context;
// };
