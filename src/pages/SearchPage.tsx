import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppDispatch } from '@/app/hooks';
import { loadProducts, openListing } from '@/features/catalog/catalogSlice';
import ProductListing from '@/components/catalog/ProductListing';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openListing({ category: null, query }));
    void dispatch(loadProducts());
  }, [dispatch, query]);

  return (
    <ProductListing
      title={query ? `Results for “${query}”` : 'All products'}
      subtitle={query ? undefined : 'The full Kapde collection.'}
    />
  );
}
