import BedroomCategories from "@/components/BedroomCategories";
import CallToAction from "@/components/CallToAction";
import FeaturedProperties from "@/components/FeaturedProperties";
import Hero from "@/components/Hero";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <CallToAction />
      <BedroomCategories />
    </>
  );
}
