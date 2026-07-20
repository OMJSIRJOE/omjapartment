import Image from "next/image";
import HeroSearch from "@/components/HeroSearch";
import { getLocations } from "@/lib/properties";

export default async function Hero() {
  const locations = await getLocations();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
        alt="Luxury OMJ Apartment residence overlooking the city"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center animate-slow-zoom"
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,10,10,0.88)_0%,rgba(10,10,10,0.55)_48%,rgba(10,10,10,0.35)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.18),transparent_50%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:justify-center md:px-8 md:pb-24 md:pt-28">
        <div className="max-w-3xl">
          <p className="animate-fade-up font-display text-4xl leading-none tracking-[0.06em] text-white sm:text-5xl md:text-7xl lg:text-[5rem]">
            OMJ <span className="text-gold">Apartment</span>
          </p>
          <h1 className="animate-fade-up-delay-1 mt-5 max-w-xl font-display text-2xl leading-snug text-white/95 sm:text-3xl md:text-4xl">
            Luxury shortlets you can reserve tonight
          </h1>
          <p className="animate-fade-up-delay-1 mt-4 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
            Book exclusive apartments and villas across Lagos — choose your dates, guests, and stay.
          </p>
        </div>

        <div className="mt-10 w-full min-w-0 md:mt-12">
          <HeroSearch locations={locations} />
        </div>
      </div>
    </section>
  );
}
