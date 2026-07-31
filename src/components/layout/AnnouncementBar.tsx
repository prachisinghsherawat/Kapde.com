import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Icon from '@/lib/icons';
import type { IconName } from '@/lib/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { dismissAnnouncement, selectAnnouncementDismissed } from '@/features/ui/uiSlice';
import { FREE_SHIPPING_OVER } from '@/lib/constants';
import { formatPrice } from '@/lib/format';

const ROTATE_MS = 4500;

/** Each message goes somewhere: a promo the shopper cannot act on is just noise. */
const MESSAGES: { icon: IconName; text: string; to: string; cta: string }[] = [
  {
    icon: 'shipping',
    text: `Free shipping on every order over ${formatPrice(FREE_SHIPPING_OVER)}`,
    to: '/search',
    cta: 'Start shopping',
  },
  {
    icon: 'offer',
    text: 'Mid-season edit — up to 60% off',
    to: '/search?sort=discount',
    cta: 'See the markdowns',
  },
  {
    icon: 'returns',
    text: '30-day free returns and exchanges',
    to: '/search?sort=newest',
    cta: 'Shop new in',
  },
];

/**
 * The strip above the header. It sits outside the sticky nav on purpose: a promo is
 * worth one look, not a permanent slice of the viewport, so it scrolls away and the
 * dismissal is remembered across visits.
 */
export default function AnnouncementBar() {
  const dispatch = useAppDispatch();
  const dismissed = useAppSelector(selectAnnouncementDismissed);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dismissed || MESSAGES.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % MESSAGES.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  const message = MESSAGES[index];

  return (
    <div className="relative isolate overflow-hidden bg-brand-600 text-white">
      <div className="container flex h-10 items-center justify-center gap-3">
        {/* Keyed on the index so each message remounts and replays its entrance;
            index.css drops the animation under prefers-reduced-motion.

            The colour has to be stated on the anchor itself, not inherited from the
            bar: Tailwind's preflight is off, so antd's global `a { color: colorLink }`
            stands — and colorLink is brand-600, this bar's own background. `hover:`
            is spelled out too, to out-specify antd's `a:hover`. */}
        <Link
          key={index}
          to={message.to}
          className="group flex animate-slide-in items-center gap-2 text-center text-xs font-medium tracking-wide text-white hover:text-white sm:text-sm"
        >
          <Icon name={message.icon} size="md" className="text-white/80" />
          <span>{message.text}</span>
          <span className="hidden items-center gap-1 font-semibold underline decoration-white/40 underline-offset-4 transition-colors group-hover:decoration-white sm:inline-flex">
            {message.cta}
            <Icon name="arrowRight" size="xs" />
          </span>
        </Link>
      </div>

      {/* Which of the three you are on, and a way out. Absolutely placed so the
          message itself stays centred on the page, not on the space left over. */}
      <div className="absolute inset-y-0 right-2 flex items-center gap-1 sm:right-4 sm:gap-2">
        <div className="hidden items-center gap-1.5 sm:flex">
          {MESSAGES.map((item, itemIndex) => (
            <button
              key={item.to}
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`Show message ${itemIndex + 1}`}
              aria-current={itemIndex === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                itemIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => dispatch(dismissAnnouncement())}
          className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        >
          <Icon name="dismiss" size="sm" />
        </button>
      </div>
    </div>
  );
}
