import { KeyIcon, ShieldIcon, StarIcon } from "@/components/icons";

const reasons = [
  {
    title: "Book Like Airbnb",
    description:
      "Search by dates and guests, see nightly pricing up front, and reserve your shortlet in minutes.",
    icon: StarIcon,
  },
  {
    title: "Verified Luxury Stays",
    description:
      "Every apartment is curated for comfort, security, and presentation — hotel polish with home privacy.",
    icon: KeyIcon,
  },
  {
    title: "Host Support",
    description:
      "From check-in guidance to WhatsApp assistance, our team helps make every stay seamless.",
    icon: ShieldIcon,
  },
];

export default function WhyChoose() {
  return (
    <section className="section-pad relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.14),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] text-gold uppercase">Why Choose Us</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">
            Why choose OMJ Apartment
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
            Shortlet stays should feel effortless — beautiful homes, clear pricing, and a reservation
            experience designed for modern travelers.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="animate-fade-up border-t border-gold/40 pt-8"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <reason.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-5 font-display text-2xl">{reason.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
