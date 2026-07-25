import type { ReactNode } from 'react';
import { Button, Checkbox, Rate, Slider, Switch } from 'antd';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearFilters,
  selectActiveFilterCount,
  selectAvailableFacets,
  selectFilters,
  setInStockOnly,
  setMinRating,
  setPriceMax,
  toggleFilterValue,
} from '@/features/catalog/catalogSlice';
import { COLOURS, RATING_OPTIONS } from '@/lib/constants';
import { formatPrice } from '@/lib/format';

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-line py-6 first:pt-0 last:border-0 last:pb-0">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">{title}</h3>
      {children}
    </section>
  );
}

export default function FilterPanel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const activeCount = useAppSelector(selectActiveFilterCount);
  const facets = useAppSelector(selectAvailableFacets);

  const colourMeta = (value: string) => COLOURS.find((colour) => colour.value === value);

  return (
    <div>
      <div className="flex items-center justify-between pb-5">
        <h2 className="font-display text-xl font-semibold text-ink">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <Button type="link" size="small" onClick={() => dispatch(clearFilters())}>
            Clear all
          </Button>
        )}
      </div>

      <Group title="Availability">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-[15px] text-ink">
          Hide sold-out items
          <Switch
            checked={filters.inStockOnly}
            onChange={(checked) => dispatch(setInStockOnly(checked))}
          />
        </label>
      </Group>

      <Group title="Brand">
        <div className="flex flex-col gap-3">
          {facets.brands.map((brand) => (
            <label
              key={brand.value}
              className="flex cursor-pointer items-center justify-between gap-3 text-[15px] text-ink"
            >
              <span className="flex items-center gap-2.5">
                <Checkbox
                  checked={filters.brands.includes(brand.value)}
                  onChange={() =>
                    dispatch(toggleFilterValue({ key: 'brands', value: brand.value }))
                  }
                />
                {brand.value}
              </span>
              <span className="text-xs tabular-nums text-muted">{brand.count}</span>
            </label>
          ))}
        </div>
      </Group>

      <Group title="Colour">
        <div className="grid grid-cols-2 gap-y-3">
          {facets.colours.map((colour) => {
            const meta = colourMeta(colour.value);
            const active = filters.colours.includes(colour.value);
            return (
              <button
                key={colour.value}
                type="button"
                aria-pressed={active}
                onClick={() => dispatch(toggleFilterValue({ key: 'colours', value: colour.value }))}
                className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[15px] transition ${
                  active ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40' : 'text-ink hover:bg-subtle'
                }`}
              >
                <span
                  className={`h-5 w-5 shrink-0 rounded-full border ${
                    active ? 'ring-2 ring-brand-600 ring-offset-1' : 'border-line'
                  }`}
                  style={
                    colour.value === 'multi'
                      ? {
                          background:
                            'conic-gradient(#ec9db8, #e8c65a, #3f9d6a, #2f6fd0, #8b5cf6, #ec9db8)',
                        }
                      : { backgroundColor: meta?.hex }
                  }
                  aria-hidden
                />
                {meta?.label ?? colour.value}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((size) => {
            const active = filters.sizes.includes(size.value);
            return (
              <button
                key={size.value}
                type="button"
                aria-pressed={active}
                onClick={() => dispatch(toggleFilterValue({ key: 'sizes', value: size.value }))}
                className={`min-w-[3.25rem] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-line bg-surface text-ink hover:border-brand-400'
                }`}
              >
                {size.value}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Max price">
        <Slider
          min={0}
          max={facets.priceCeiling}
          step={5}
          value={filters.priceMax ?? facets.priceCeiling}
          tooltip={{ formatter: (value) => formatPrice(value ?? 0) }}
          onChange={(value) => dispatch(setPriceMax(value >= facets.priceCeiling ? null : value))}
        />
        <p className="text-[15px] text-muted">
          Up to{' '}
          <span className="font-semibold text-ink">
            {formatPrice(filters.priceMax ?? facets.priceCeiling)}
          </span>
        </p>
      </Group>

      <Group title="Rating">
        <div className="flex flex-col gap-3">
          {RATING_OPTIONS.map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center gap-2.5 text-[15px] text-ink"
            >
              <Checkbox
                checked={filters.minRating === rating}
                onChange={(event) => dispatch(setMinRating(event.target.checked ? rating : null))}
              />
              <Rate disabled allowHalf value={rating} className="!text-xs" />
              <span className="text-muted">& up</span>
            </label>
          ))}
        </div>
      </Group>
    </div>
  );
}
