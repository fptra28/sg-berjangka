// // components/GoogleTranslate.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Script from "next/script";

// declare global {
//     interface Window {
//         googleTranslateElementInit: () => void;
//     }
// }

// export default function GoogleTranslate() {
//     const [currentLang, setCurrentLang] = useState<"id" | "en">("id");
//     const [ready, setReady] = useState(false);

//     // init google translate widget
//     useEffect(() => {
//         window.googleTranslateElementInit = () => {
//             new window.google.translate.TranslateElement(
//                 {
//                     pageLanguage: "id",
//                     includedLanguages: "id,en",
//                     layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//                 },
//                 "google_translate_element"
//             );
//         };

//         // cek setiap 500ms apakah select sudah muncul
//         const interval = setInterval(() => {
//             if (document.querySelector(".goog-te-combo")) {
//                 setReady(true);
//                 clearInterval(interval);
//             }
//         }, 500);

//         return () => clearInterval(interval);
//     }, []);

//     const toggleLang = () => {
//         const select: HTMLSelectElement | null = document.querySelector(
//             ".goog-te-combo"
//         );
//         if (!select) return;

//         const nextLang = currentLang === "id" ? "en" : "id";
//         select.value = nextLang;
//         select.dispatchEvent(new Event("change"));
//         setCurrentLang(nextLang);
//     };

//     return (
//         <>
//             {/* dropdown asli disembunyikan */}
//             <div id="google_translate_element" className="hidden" />

//             {/* script google translate */}
//             <Script
//                 src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//                 strategy="afterInteractive"
//             />

//             {/* tombol toggle */}
//             <div className="fixed bottom-4 left-4 z-50">
//                 <button
//                     disabled={!ready}
//                     onClick={toggleLang}
//                     className="px-4 py-2 bg-white text-black rounded shadow hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     {currentLang === "id"
//                         ? "Translate to English"
//                         : "Terjemahkan ke Indonesia"}
//                 </button>
//             </div>
//         </>
//     );
// }
