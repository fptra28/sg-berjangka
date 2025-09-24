import "../styles/globals.css";
import type { AppProps } from "next/app";
import { TranslateProvider } from "@/providers/TranslateProvider";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <Component {...pageProps} />
  );
}
