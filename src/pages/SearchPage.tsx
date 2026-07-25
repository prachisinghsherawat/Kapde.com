import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppDispatch } from '@/app/hooks';
import { loadProducts, openListing, setSort } from '@/features/catalog/catalogSlice';
import ProductListing from '@/components/catalog/ProductListing';
import { SORT_OPTIONS } from '@/lib/constants';
import type { SortKey } from '@/types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const sort = searchParams.get('sort');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openListing({ category: null, query }));
    if (SORT_OPTIONS.some((option) => option.value === sort)) {
      dispatch(setSort(sort as SortKey));
    }
    void dispatch(loadProducts());
  }, [dispatch, query, sort]);

  return (
    <ProductListing
      title={query ? `Results for “${query}”` : 'All products'}
      subtitle={query ? undefined : 'The full Kapde collection.'}
    />
  );
}
