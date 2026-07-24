import { Button, Checkbox, Slider } from 'antd';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearFilters,
  selectActiveFilterCount,
  selectFilters,
  selectPriceCeiling,
  setPriceMax,
  toggleFilterValue,
} from '@/features/catalog/catalogSlice';
import { BRANDS, COLOURS, SIZES, SIZE_LABELS } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { FilterListKey } from '@/types';

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line py-5 first:pt-0 last:border-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      {children}
    </section>
  );
}

export default function FilterPanel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const activeCount = useAppSelector(selectActiveFilterCount);
  const priceCeiling = useAppSelector(selectPriceCeiling);

  const toggle = (key: FilterListKey, value: string) =>
    dispatch(toggleFilterValue({ key, value }));

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-display text-lg font-semibold text-ink">Filters</h2>
        {activeCount > 0 && (
          <Button type="link" size="small" onClick={() => dispatch(clearFilters())}>
            Clear all
          </Button>
        )}
      </div>

      <Group title="Colour">
        <div className="grid grid-cols-2 gap-y-2.5">
          {COLOURS.map((colour) => (
            <label
              key={colour.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-ink"
            >
              <Checkbox
                checked={filters.colours.includes(colour.value)}
                onChange={() => toggle('colours', colour.value)}
              />
              <span
                className="h-4 w-4 shrink-0 rounded-full border border-line"
                style={{ backgroundColor: colour.hex }}
                aria-hidden
              />
              {colour.label}
            </label>
          ))}
        </div>
      </Group>

      <Group title="Brand">
        <div className="flex flex-col gap-2.5">
          {BRANDS.map((brand) => (
            <label
              key={brand.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-ink"
            >
              <Checkbox
                checked={filters.brands.includes(brand.value)}
                onChange={() => toggle('brands', brand.value)}
              />
              {brand.label}
            </label>
          ))}
        </div>
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => toggle('sizes', size)}
                className={`min-w-[3rem] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-line bg-surface text-ink hover:border-brand-300'
                }`}
                title={SIZE_LABELS[size]}
              >
                {size}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Max price">
        <Slider
          min={0}
          max={priceCeiling}
          step={100}
          value={filters.priceMax ?? priceCeiling}
          tooltip={{ formatter: (value) => formatPrice(value ?? 0) }}
          onChange={(value) =>
            dispatch(setPriceMax(value >= priceCeiling ? null : value))
          }
        />
        <p className="text-sm text-muted">
          Up to <span className="font-semibold text-ink">{formatPrice(filters.priceMax ?? priceCeiling)}</span>
        </p>
      </Group>
    </div>
  );
}
