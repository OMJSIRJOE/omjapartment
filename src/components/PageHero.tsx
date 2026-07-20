import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
}

export default function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative min-h-[42vh] overflow-hidden md:min-h-[48vh]">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-navy/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.18),transparent_50%)]" />
      <div className="relative mx-auto flex min-h-[42vh] max-w-7xl flex-col justify-end px-5 pb-12 pt-32 md:min-h-[48vh] md:px-8 md:pb-16">
        <div className="animate-fade-up">
          <Image
            src="/logo.png"
            alt="OMJ Apartment & Properties"
            width={127}
            height={50}
            className="h-[50px] w-auto object-contain"
            priority
          />
        </div>
        <h1 className="animate-fade-up-delay-1 mt-4 font-display text-4xl text-white md:text-6xl">
          {title}
        </h1>
        <p className="animate-fade-up-delay-1 mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
