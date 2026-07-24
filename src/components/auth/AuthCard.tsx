import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  title: string;
  subtitle: string;
  footer: { text: string; linkLabel: string; to: string };
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <div className="container flex animate-fade-up items-center justify-center py-12 lg:py-20">
      <div className="w-full max-w-md">
        <div className="surface-card p-8">
          <Link to="/" className="font-display text-2xl font-bold text-ink">
            Kapde<span className="text-brand-600">.</span>
          </Link>

          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {footer.text}{' '}
          <Link to={footer.to} className="font-medium text-brand-600 hover:underline">
            {footer.linkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
