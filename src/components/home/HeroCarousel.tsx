import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Carousel } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';

import Icon from '@/lib/icons';
import { useAppSelector } from '@/app/hooks';
import { HERO_PICKS_ALL, selectHeroPicks } from '@/features/catalog/catalogSlice';
import ProductImage from '@/components/product/ProductImage';
import { BANNERS } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { CategorySlug } from '@/types';

const AUTOPLAY_MS = 5500;

/** `pick` names the catalogue bucket each slide pulls its shop-the-look photos from. */
const SLIDES: {
  eyebrow: string;
  title: string;
  body: string;
  label: string;
  pick: CategorySlug | typeof HERO_PICKS_ALL;
  cta: { label: string; to: string };
}[] = [
  {
    eyebrow: 'New season',
    title: 'Womenswear,\nbuilt to last.',
    body: 'Dresses, co-ords and knitwear from Zara, Mango, H&M and more.',
    label: 'New in',
    pick: 'knitwear',
    cta: { label: 'Shop new in', to: '/search' },
  },
  {
    eyebrow: 'Up to 50% off',
    title: 'Mid-season\nmarkdowns.',
    body: 'The biggest reductions across dresses, co-ords and outerwear.',
    label: 'Sale',
    pick: HERO_PICKS_ALL,
    cta: { label: 'Shop the sale', to: '/search?sort=discount' },
  },
  {
    eyebrow: 'The dress shop',
    title: 'A dress for\nevery plan.',
    body: 'Midi, maxi, wrap and slip — occasion or otherwise.',
    label: 'Dresses',
    pick: 'dresses',
    cta: { label: 'Shop dresses', to: '/c/dresses' },
  },
  {
    eyebrow: 'Matching sets',
    title: 'Two pieces,\none decision.',
    body: 'Co-ord sets that do the styling for you, top and bottom together.',
    label: 'Co-ords',
    pick: 'coord-sets',
    cta: { label: 'Shop co-ords', to: '/c/coord-sets' },
  },
  {
    eyebrow: 'Denim edit',
    title: 'Jeans that\nactually fit.',
    body: 'High rise, mom, wide leg and straight — sized 26 to 36.',
    label: 'Denim',
    pick: 'jeans',
    cta: { label: 'Shop denim', to: '/c/jeans' },
  },
  {
    eyebrow: 'Layer up',
    title: 'Coats, knits\nand jackets.',
    body: 'Trenches, puffers and merino for the turn in the weather.',
    label: 'Outerwear',
    pick: 'outerwear',
    cta: { label: 'Shop outerwear', to: '/c/outerwear' },
  },
];

export default function HeroCarousel() {
  const carouselRef = useRef<CarouselRef>(null);
  const [current, setCurrent] = useState(0);
  const picks = useAppSelector(selectHeroPicks);

  const slides = SLIDES.slice(0, BANNERS.length).map((slide, index) => ({
    ...slide,
    banner: BANNERS[index],
    // Two is enough to read as a styled pair without crowding the headline.
    products: (picks.get(slide.pick) ?? []).slice(0, 2),
  }));

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') carouselRef.current?.prev();
        if (event.key === 'ArrowRight') carouselRef.current?.next();
      }}
      className="group relative overflow-hidden bg-ink"
    >
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={AUTOPLAY_MS}
        speed={800}
        pauseOnHover
        draggable
        dots={false}
        beforeChange={(_, next) => setCurrent(next)}
      >
        {slides.map((slide, index) => (
          <div key={slide.banner.id}>
            <div className="relative h-[480px] w-full overflow-hidden sm:h-[560px] lg:h-[640px]">
              <img
                src={slide.banner.image}
                alt={slide.banner.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                className={`absolute inset-0 h-full w-full object-cover ${
                  index === current ? 'animate-kenburns' : 'scale-105'
                }`}
              />
              {/* Only as much scrim as the copy needs: a wash across the left, and a
                  short fade at the foot for the control bar. The photograph carries
                  the rest. */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="container relative flex h-full items-center gap-10 pb-24">
                {index === current && (
                  <>
                    <div className="w-full min-w-0 max-w-xl text-white">
                      <span className="inline-flex animate-slide-in items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur [animation-delay:80ms]">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                        {slide.eyebrow}
                      </span>
                      <h2 className="mt-5 animate-slide-in whitespace-pre-line font-display text-4xl font-bold leading-[1.05] tracking-tight drop-shadow sm:text-5xl lg:text-6xl [animation-delay:160ms]">
                        {slide.title}
                      </h2>
                      <p className="mt-4 max-w-md animate-slide-in text-base text-white/85 [animation-delay:240ms] sm:text-lg">
                        {slide.body}
                      </p>
                      <div className="mt-8 flex animate-slide-in flex-wrap items-center gap-3 [animation-delay:320ms]">
                        <Link to={slide.cta.to}>
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
                        <Link
                          to="/search?sort=newest"
                          className="inline-flex h-12 items-center rounded-lg border border-white/40 px-6 text-base font-medium text-white backdrop-blur transition-colors hover:border-white hover:bg-white/15"
                        >
                          Browse everything
                        </Link>
                      </div>
                    </div>

                    {/* The same catalogue photos the grids below use, so the hero
                        promises stock that actually exists. Solid cards, not glass:
                        translucent panels over photography turn to mud. */}
                    {slide.products.length > 0 && (
                      <div className="ml-auto hidden shrink-0 flex-col items-end gap-3 lg:flex">
                        <p className="animate-slide-in text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 [animation-delay:400ms]">
                          In this edit
                        </p>
                        <div className="flex gap-4">
                          {slide.products.map((product, productIndex) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              style={{ animationDelay: `${460 + productIndex * 110}ms` }}
                              className="group/pick w-40 animate-slide-in overflow-hidden rounded-2xl bg-surface shadow-lift transition-transform duration-300 hover:-translate-y-1.5"
                            >
                              <div className="relative aspect-[3/4] overflow-hidden bg-subtle">
                                <ProductImage
                                  src={product.thumbnail}
                                  alt={product.title}
                                  eager
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover/pick:scale-105"
                                />
                                {product.discount > 0 && (
                                  <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                    {product.discount}% off
                                  </span>
                                )}
                              </div>
                              <div className="p-3">
                                <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted">
                                  {product.brand}
                                </p>
                                <p className="line-clamp-1 text-sm font-medium text-ink">
                                  {product.title}
                                </p>
                                <div className="mt-1">
                                  <Price price={product.price} mrp={product.mrp} size="sm" showBadge={false} />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Control bar: counter, and the banner photos themselves as slide pickers. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-6">
        <div className="container flex items-end justify-between gap-6">
          <p className="pointer-events-auto font-display text-sm text-white/80">
            <span className="text-lg font-semibold text-white">
              {String(current + 1).padStart(2, '0')}
            </span>
            <span className="mx-1.5">/</span>
            {String(slides.length).padStart(2, '0')}
          </p>

          {/* min-w-0 so the rail scrolls on narrow screens instead of widening the page. */}
          <div className="pointer-events-auto flex min-w-0 gap-2 overflow-x-auto no-scrollbar">
            {slides.map((slide, index) => (
              <button
                key={slide.banner.id}
                type="button"
                onClick={() => carouselRef.current?.goTo(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.label}`}
                aria-current={index === current}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                  index === current
                    ? 'border-white opacity-100 ring-2 ring-white/60'
                    : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={slide.banner.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 truncate px-1.5 pb-1 text-[11px] font-semibold text-white">
                  {slide.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Autoplay timer. Keyed on the index so it restarts with each slide, and
          paused on hover to match the carousel's own pauseOnHover. */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-white/20">
        <div
          key={current}
          style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
          className="h-full origin-left animate-progress bg-white group-hover:[animation-play-state:paused]"
        />
      </div>

      {/* Arrows fade in on hover. Touch gets the swipe and the thumbnail rail
          instead — a permanent arrow there just sits on top of the headline. */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => carouselRef.current?.prev()}
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-lg text-white opacity-0 backdrop-blur transition hover:bg-white/30 focus-visible:opacity-100 group-hover:opacity-100 lg:grid"
      >
        <Icon name="chevronLeft" size="xl" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => carouselRef.current?.next()}
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-lg text-white opacity-0 backdrop-blur transition hover:bg-white/30 focus-visible:opacity-100 group-hover:opacity-100 lg:grid"
      >
        <Icon name="chevronRight" size="xl" />
      </button>
    </section>
  );
}
