"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-navy/10 md:aspect-[21/10]">
        <Image
          src={images[active]}
          alt={`${title} — image ${active + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />

        <button
          type="button"
          onClick={prev}
          aria-label="Previous image"
          className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-navy transition hover:bg-gold md:left-5"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next image"
          className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-navy transition hover:bg-gold md:right-5"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        <p className="absolute right-4 bottom-4 text-xs tracking-[0.16em] text-white/90 uppercase">
          {active + 1} / {images.length}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 md:gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`View image ${index + 1}`}
            className={cn(
              "relative aspect-[4/3] overflow-hidden transition",
              active === index ? "ring-2 ring-gold ring-offset-2" : "opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
