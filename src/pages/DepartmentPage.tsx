import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '@/app/hooks';
import { loadProducts, openListing } from '@/features/catalog/catalogSlice';
import ProductListing from '@/components/catalog/ProductListing';
import { getDepartment, isGender } from '@/lib/constants';

export default function DepartmentPage() {
  const { gender } = useParams<{ gender: string }>();
  const dispatch = useAppDispatch();
  const valid = isGender(gender);

  useEffect(() => {
    if (!valid) return;
    dispatch(openListing({ category: null, gender }));
    void dispatch(loadProducts());
  }, [dispatch, gender, valid]);

  if (!valid) return <Navigate to="/404" replace />;

  const meta = getDepartment(gender);

  return (
    <ProductListing
      title={`${meta?.singular ?? ''} Collection`.trim()}
      subtitle={`Everything we stock for ${meta?.label.toLowerCase() ?? 'you'}, filtered your way.`}
    />
  );
}
