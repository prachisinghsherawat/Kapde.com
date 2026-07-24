import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '@/app/hooks';
import { loadProducts, openListing } from '@/features/catalog/catalogSlice';
import ProductListing from '@/components/catalog/ProductListing';
import { getCategory, isCategorySlug } from '@/lib/constants';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const dispatch = useAppDispatch();
  const valid = isCategorySlug(category);

  useEffect(() => {
    if (!valid) return;
    dispatch(openListing({ category }));
    void dispatch(loadProducts());
  }, [dispatch, category, valid]);

  if (!valid) return <Navigate to="/404" replace />;

  const meta = getCategory(category);

  return (
    <ProductListing
      title={meta?.label ?? 'Products'}
      subtitle={`Every ${meta?.singular.toLowerCase() ?? 'piece'} in the collection, filtered your way.`}
    />
  );
}
