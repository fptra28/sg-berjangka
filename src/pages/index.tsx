import AutoModal from "@/components/moleculs/AutoModal";
import Banner from "@/components/organism/Banner";
import MarketUpdate from "@/components/organism/MarketUpdate";
import NewsHome from "@/components/organism/NewsHome";
import VideoGaleri from "@/components/organism/VideoGaleri";
import Watcher from "@/components/organism/Watcher";
import PageTemplates from "@/components/templates/PageTemplates";
import FloatingTranslate from "@/components/organism/FloatingTranslate"; // tambahkan

export default function Home() {
  return (
    <PageTemplates title="Home">
      <Banner />
      <MarketUpdate />
      <VideoGaleri />
      <Watcher />
      <NewsHome />
      <AutoModal />
    </PageTemplates>
  );
}
