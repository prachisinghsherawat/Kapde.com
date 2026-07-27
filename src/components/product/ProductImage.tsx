import { useEffect, useState } from 'react';

import Icon from '@/lib/icons';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/**
 * Remote images can 404 or be blocked. Rather than leaving a broken-image icon in
 * the middle of the grid, fall back to a neutral placeholder tile.
 */
export default function ProductImage({ src, alt, className, eager = false }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-subtle text-2xl text-muted ${className ?? ''}`}>
        <Icon name="imageFallback" size="2xl" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
