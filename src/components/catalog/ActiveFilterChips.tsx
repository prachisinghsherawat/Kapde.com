import { Tag } from 'antd';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearFilters,
  selectFilters,
  setInStockOnly,
  setMinRating,
  setPriceMax,
  toggleFilterValue,
} from '@/features/catalog/catalogSlice';
import { formatPrice, titleCase } from '@/lib/format';

const chipClass = '!m-0 !rounded-full !bg-subtle !px-3 !py-1 !text-sm !text-ink';

export default function ActiveFilterChips() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  const listChips = (['brands', 'tags'] as const).flatMap((key) =>
    filters[key].map((value) => ({ key, value })),
  );

  const hasAny =
    listChips.length > 0 ||
    filters.priceMax !== null ||
    filters.minRating !== null ||
    filters.inStockOnly;

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {listChips.map(({ key, value }) => (
        <Tag
          key={`${key}-${value}`}
          closable
          bordered={false}
          onClose={() => dispatch(toggleFilterValue({ key, value }))}
          className={chipClass}
        >
          {titleCase(value)}
        </Tag>
      ))}

      {filters.priceMax !== null && (
        <Tag closable bordered={false} onClose={() => dispatch(setPriceMax(null))} className={chipClass}>
          Under {formatPrice(filters.priceMax)}
        </Tag>
      )}

      {filters.minRating !== null && (
        <Tag closable bordered={false} onClose={() => dispatch(setMinRating(null))} className={chipClass}>
          {filters.minRating}★ & up
        </Tag>
      )}

      {filters.inStockOnly && (
        <Tag
          closable
          bordered={false}
          onClose={() => dispatch(setInStockOnly(false))}
          className={chipClass}
        >
          In stock only
        </Tag>
      )}

      <button
        type="button"
        onClick={() => dispatch(clearFilters())}
        className="text-sm font-medium text-brand-600 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
