import { Link } from 'react-router-dom';
import { Button, Carousel } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { BANNERS } from '@/lib/constants';

/**
 * Copy is paired with a banner by index, so the slide count is driven by whichever
 * list is shorter and a missing image can never produce an empty slide.
 */
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
  const slides = SLIDES.slice(0, BANNERS.length).map((slide, index) => ({
    ...slide,
    banner: BANNERS[index],
  }));

  return (
    <section className="relative">
      <Carousel autoplay autoplaySpeed={5500} effect="fade" dots={{ className: 'kapde-dots' }}>
        {slides.map((slide) => (
          <div key={slide.banner.id}>
            <div className="relative h-[420px] w-full overflow-hidden sm:h-[520px] lg:h-[600px]">
              <img
                src={slide.banner.image}
                alt={slide.banner.alt}
                loading="eager"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Scrim keeps the copy legible whatever the photograph is doing behind it. */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

              <div className="container relative flex h-full items-center">
                <div className="max-w-xl text-white">
                  <span className="inline-flex rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                    {slide.eyebrow}
                  </span>
                  <h2 className="mt-5 whitespace-pre-line font-display text-4xl font-bold leading-[1.05] tracking-tight drop-shadow sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 max-w-md text-base text-white/85 sm:text-lg">{slide.body}</p>
                  <Link to={slide.cta.to} className="mt-8 inline-block">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ArrowRightOutlined />}
                      iconPosition="end"
                    >
                      {slide.cta.label}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
