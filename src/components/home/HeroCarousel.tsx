import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Carousel } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';

import Icon from '@/lib/icons';
import { BANNERS } from '@/lib/constants';

const SLIDES = [
  {
    eyebrow: 'New season',
    title: 'Womenswear,\nbuilt to last.',
    body: 'Dresses, co-ords and knitwear from Zara, Mango, H&M and more.',
    cta: { label: 'Shop new in', to: '/search' },
  },
  {
    eyebrow: 'Up to 50% off',
    title: 'Mid-season\nmarkdowns.',
    body: 'The biggest reductions across dresses, co-ords and outerwear.',
    cta: { label: 'Shop the sale', to: '/search?sort=discount' },
  },
  {
    eyebrow: 'The dress shop',
    title: 'A dress for\nevery plan.',
    body: 'Midi, maxi, wrap and slip — occasion or otherwise.',
    cta: { label: 'Shop dresses', to: '/c/dresses' },
  },
  {
    eyebrow: 'Matching sets',
    title: 'Two pieces,\none decision.',
    body: 'Co-ord sets that do the styling for you, top and bottom together.',
    cta: { label: 'Shop co-ords', to: '/c/coord-sets' },
  },
  {
    eyebrow: 'Denim edit',
    title: 'Jeans that\nactually fit.',
    body: 'High rise, mom, wide leg and straight — sized 26 to 36.',
    cta: { label: 'Shop denim', to: '/c/jeans' },
  },
  {
    eyebrow: 'Layer up',
    title: 'Coats, knits\nand jackets.',
    body: 'Trenches, puffers and merino for the turn in the weather.',
    cta: { label: 'Shop outerwear', to: '/c/outerwear' },
  },
];

export default function HeroCarousel() {
  const carouselRef = useRef<CarouselRef>(null);
  const [current, setCurrent] = useState(0);

  const slides = SLIDES.slice(0, BANNERS.length).map((slide, index) => ({
    ...slide,
    banner: BANNERS[index],
  }));

  return (
    <section className="group relative overflow-hidden">
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={4000}
        speed={800}
        pauseOnHover
        draggable
        dots={{ className: 'kapde-dots' }}
        beforeChange={(_, next) => setCurrent(next)}
      >
        {slides.map((slide, index) => (
          <div key={slide.banner.id}>
            <div className="relative h-[440px] w-full overflow-hidden sm:h-[540px] lg:h-[620px]">
              <img
                src={slide.banner.image}
                alt={slide.banner.alt}
                loading="eager"
                fetchPriority="high"
                className={`absolute inset-0 h-full w-full object-cover ${
                  index === current ? 'animate-kenburns' : 'scale-105'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />

              <div className="container relative flex h-full items-center">
                {index === current && (
                  <div className="max-w-xl text-white">
                    <span className="inline-flex animate-slide-in rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur [animation-delay:80ms]">
                      {slide.eyebrow}
                    </span>
                    <h2 className="mt-5 animate-slide-in whitespace-pre-line font-display text-4xl font-bold leading-[1.05] tracking-tight drop-shadow sm:text-5xl lg:text-6xl [animation-delay:160ms]">
                      {slide.title}
                    </h2>
                    <p className="mt-4 max-w-md animate-slide-in text-base text-white/85 [animation-delay:240ms] sm:text-lg">
                      {slide.body}
                    </p>
                    <Link
                      to={slide.cta.to}
                      className="mt-8 inline-block animate-slide-in [animation-delay:320ms]"
                    >
                      <Button
                        type="primary"
                        size="large"
                        icon={<Icon name="arrowRight" />}
                        iconPosition="end"
                        className="!h-12 !px-7 !text-base"
                      >
                        {slide.cta.label}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Arrows fade in on hover; the carousel keeps auto-advancing regardless. */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => carouselRef.current?.prev()}
        className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-lg text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100"
      >
        <Icon name="chevronLeft" size="xl" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => carouselRef.current?.next()}
        className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-lg text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100"
      >
        <Icon name="chevronRight" size="xl" />
      </button>
    </section>
  );
}
