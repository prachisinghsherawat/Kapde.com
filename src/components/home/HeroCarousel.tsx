import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Carousel } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

import { BANNERS } from '@/lib/constants';

const SLIDES = [
  {
    eyebrow: 'New season',
    title: 'Everyday pieces,\nbuilt to last.',
    body: 'Denim, knitwear and tailoring from Levi’s, Zara, H&M and more.',
    cta: { label: 'Shop new in', to: '/search' },
  },
  {
    eyebrow: 'Up to 50% off',
    title: 'Mid-season\nmarkdowns.',
    body: 'The biggest reductions across dresses, jackets and jeans.',
    cta: { label: 'Shop the sale', to: '/search?sort=discount' },
  },
  {
    eyebrow: 'Denim edit',
    title: 'Jeans that\nactually fit.',
    body: 'Straight, wide leg, mom and slim — sized 26 to 36.',
    cta: { label: 'Shop denim', to: '/c/jeans' },
  },
  {
    eyebrow: 'Layer up',
    title: 'Coats and\njackets.',
    body: 'Trenches, truckers and puffers for the turn in the weather.',
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
                        icon={<ArrowRightOutlined />}
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
        <LeftOutlined />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => carouselRef.current?.next()}
        className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-lg text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100"
      >
        <RightOutlined />
      </button>
    </section>
  );
}
