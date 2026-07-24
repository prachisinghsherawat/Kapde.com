import { Tag } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearFilters,
  selectFilters,
  setPriceMax,
  toggleFilterValue,
} from '@/features/catalog/catalogSlice';
import { BRANDS, COLOURS, SIZE_LABELS } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { FilterListKey, Size } from '@/types';

const labelFor = (key: FilterListKey, value: string): string => {
  if (key === 'colours') return COLOURS.find((c) => c.value === value)?.label ?? value;
  if (key === 'brands') return BRANDS.find((b) => b.value === value)?.label ?? value;
  return SIZE_LABELS[value as Size] ?? value;
};

export default function ActiveFilterChips() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  const chips = (['colours', 'brands', 'sizes'] as const).flatMap((key) =>
    filters[key].map((value) => ({ key, value })),
  );

  if (chips.length === 0 && filters.priceMax === null) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map(({ key, value }) => (
        <Tag
          key={`${key}-${value}`}
          closable
          bordered={false}
          onClose={() => dispatch(toggleFilterValue({ key, value }))}
          className="!m-0 !rounded-full !bg-subtle !px-3 !py-1 !text-ink"
        >
          {labelFor(key, value)}
        </Tag>
      ))}

      {filters.priceMax !== null && (
        <Tag
          closable
          bordered={false}
          onClose={() => dispatch(setPriceMax(null))}
          className="!m-0 !rounded-full !bg-subtle !px-3 !py-1 !text-ink"
        >
          Under {formatPrice(filters.priceMax)}
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
