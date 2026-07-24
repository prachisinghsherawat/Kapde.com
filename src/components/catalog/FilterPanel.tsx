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
import { RATING_OPTIONS } from '@/lib/constants';
import { formatPrice, titleCase } from '@/lib/format';
import type { FilterListKey } from '@/types';

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line py-6 first:pt-0 last:border-0 last:pb-0">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">{title}</h3>
      {children}
    </section>
  );
}

function FacetList({
  facetKey,
  options,
  selected,
  limit = 8,
}: {
  facetKey: FilterListKey;
  options: { value: string; count: number }[];
  selected: string[];
  limit?: number;
}) {
  const dispatch = useAppDispatch();
  // Long tails stay out of the way until the shopper opts in.
  const visible = options.slice(0, limit);
  const hidden = options.slice(limit).filter((option) => selected.includes(option.value));

  return (
    <div className="flex flex-col gap-3">
      {[...visible, ...hidden].map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center justify-between gap-3 text-[15px] text-ink"
        >
          <span className="flex items-center gap-2.5">
            <Checkbox
              checked={selected.includes(option.value)}
              onChange={() => dispatch(toggleFilterValue({ key: facetKey, value: option.value }))}
            />
            {titleCase(option.value)}
          </span>
          <span className="text-xs tabular-nums text-muted">{option.count}</span>
        </label>
      ))}
      {options.length === 0 && <p className="text-sm text-muted">Nothing to filter here.</p>}
    </div>
  );
}

export default function FilterPanel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const activeCount = useAppSelector(selectActiveFilterCount);
  const facets = useAppSelector(selectAvailableFacets);

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
        <FacetList facetKey="brands" options={facets.brands} selected={filters.brands} />
      </Group>

      <Group title="Product type">
        <FacetList facetKey="tags" options={facets.tags} selected={filters.tags} limit={10} />
      </Group>

      <Group title="Max price">
        <Slider
          min={0}
          max={facets.priceCeiling}
          step={facets.priceCeiling > 1000 ? 50 : 5}
          value={filters.priceMax ?? facets.priceCeiling}
          tooltip={{ formatter: (value) => formatPrice(value ?? 0) }}
          onChange={(value) =>
            dispatch(setPriceMax(value >= facets.priceCeiling ? null : value))
          }
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
                onChange={(event) =>
                  dispatch(setMinRating(event.target.checked ? rating : null))
                }
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
