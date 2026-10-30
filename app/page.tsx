import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Kodawari } from "@/components/sections/Kodawari";
import { ReservationBanner } from "@/components/sections/ReservationBanner";
import { SiteNotices } from "@/components/sections/SiteNotices";
import { CourseMenu } from "@/components/sections/CourseMenu";
import { Scenes } from "@/components/sections/Scenes";
import { Interior } from "@/components/sections/Interior";
import { Reserve } from "@/components/sections/Reserve";
import { Gallery } from "@/components/sections/Gallery";
import { Access } from "@/components/sections/Access";

export default function Home() {
  return (
    <div className="relative w-full overflow-x-clip overflow-y-visible bg-ink text-cream">
      <Header />
      <Hero />
      <SiteNotices />
      <About />
      <Kodawari />
      <ReservationBanner />
      <CourseMenu />
      <Scenes />
      <Interior />
      <Reserve />
      <Gallery />
      <Access />
      <Footer />
    </div>
  );
}
