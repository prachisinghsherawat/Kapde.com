import { Link } from 'react-router-dom';
import { App, Button, Input } from 'antd';
import { useState } from 'react';

import Icon from '@/lib/icons';
import { CATEGORIES } from '@/lib/constants';
import appleBadge from '@/assets/apple.png';
import googleBadge from '@/assets/google.png';

const COLUMNS = [
  {
    title: 'Company',
    links: ['About us', 'Careers', 'Press', 'Sustainability', 'Store locator'],
  },
  {
    title: 'Help',
    links: ['Contact us', 'Shipping', 'Returns & exchanges', 'Size guide', 'Track order'],
  },
  {
    title: 'Legal',
    links: ['Terms of use', 'Privacy policy', 'Cookie policy', 'Accessibility'],
  },
];

const SOCIALS = [
  { label: 'Instagram', icon: 'instagram' },
  { label: 'X', icon: 'x' },
  { label: 'Facebook', icon: 'facebook' },
] as const;

export default function Footer() {
  const { message } = App.useApp();
  const [email, setEmail] = useState('');

  const subscribe = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error('Please enter a valid email address.');
      return;
    }
    setEmail('');
    message.success('You are on the list — watch your inbox.');
  };

  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link to="/" className="font-display text-2xl font-bold text-ink">
              Kapde<span className="text-brand-600">.</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Considered wardrobe staples, made to be worn for years rather than a season.
            </p>

            <div className="mt-6 max-w-sm">
              <p className="mb-2 text-sm font-semibold text-ink">Get first access to new drops</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(event) => setEmail(event.target.value)}
                  onPressEnter={subscribe}
                  aria-label="Email address"
                />
                <Button type="primary" onClick={subscribe}>
                  Subscribe
                </Button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {SOCIALS.map((social) => (
                <button
                  key={social.label}
                  type="button"
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-brand-600 hover:text-brand-600"
                >
                  <Icon name={social.icon} size="md" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Shop</h3>
              <ul className="space-y-2">
                {CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/c/${category.slug}`}
                      className="text-sm text-muted transition-colors hover:text-brand-600"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 text-sm font-semibold text-ink">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link} className="text-sm text-muted">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Icon name="phone" size="sm" /> 1800 123 1555
            </span>
            <span className="flex items-center gap-2">
              <Icon name="mail" size="sm" /> help@kapde.com
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img src={appleBadge} alt="Download on the App Store" className="h-10 w-auto" />
            <img src={googleBadge} alt="Get it on Google Play" className="h-10 w-auto" />
          </div>
        </div>

        <p className="mt-8 text-xs text-muted">
          © {new Date().getFullYear()} Kapde. A demo storefront — no real orders are placed.
        </p>
      </div>
    </footer>
  );
}
