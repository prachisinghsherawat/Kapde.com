import { useRef } from 'react';
import { Badge, Button, Drawer, Pagination, Result, Select } from 'antd';

import Icon from '@/lib/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearFilters,
  loadProducts,
  selectActiveFilterCount,
  selectCatalogError,
  selectCatalogStatus,
  selectPage,
  selectPagedProducts,
  selectSort,
  selectVisibleProducts,
  setPage,
  setSort,
} from '@/features/catalog/catalogSlice';
import { selectFilterDrawerOpen, setFilterDrawer } from '@/features/ui/uiSlice';
import { PAGE_SIZE, SORT_OPTIONS } from '@/lib/constants';
import { pluralize } from '@/lib/format';
import ActiveFilterChips from './ActiveFilterChips';
import FilterPanel from './FilterPanel';
import EmptyState from '@/components/common/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import type { SortKey } from '@/types';

interface ProductListingProps {
  title: string;
  subtitle?: string;
}

export default function ProductListing({ title, subtitle }: ProductListingProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCatalogStatus);
  const error = useAppSelector(selectCatalogError);
  const products = useAppSelector(selectPagedProducts);
  const total = useAppSelector(selectVisibleProducts).length;
  const page = useAppSelector(selectPage);
  const sort = useAppSelector(selectSort);
  const activeFilterCount = useAppSelector(selectActiveFilterCount);
  const drawerOpen = useAppSelector(selectFilterDrawerOpen);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const loading = status === 'loading' || status === 'idle';

  if (status === 'failed') {
    return (
      <Result
        status="warning"
        title="We could not load the collection"
        subTitle={error ?? 'Please check your connection and try again.'}
        extra={
          <Button type="primary" onClick={() => void dispatch(loadProducts())}>
            Try again
          </Button>
        }
      />
    );
  }

  const changePage = (next: number) => {
    dispatch(setPage(next));
    // Jump back to the top of the results so page 2 doesn't start mid-scroll.
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container py-8 lg:py-10">
      <header className="mb-5">
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </header>

      {/* Full-width toolbar so the filter column and the product grid start on the
          same line below it. */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
        <p className="text-sm text-muted">
          {loading ? 'Loading the collection…' : pluralize(total, 'product')}
        </p>

        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <Badge count={activeFilterCount} size="small" offset={[-2, 2]}>
              <Button icon={<Icon name="filter" />} onClick={() => dispatch(setFilterDrawer(true))}>
                Filters
              </Button>
            </Badge>
          </div>

          <Select<SortKey>
            value={sort}
            options={SORT_OPTIONS}
            onChange={(value) => dispatch(setSort(value))}
            className="w-48"
            aria-label="Sort products"
          />
        </div>
      </div>

      {/* Chips sit above both columns so the grid's first row always stays level
          with the top of the filter box, filters active or not. */}
      <div className="mb-6 empty:hidden">
        <ActiveFilterChips />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
        {/* The column stretches to the height of the grid beside it, and a filter list
            longer than that scrolls inside the card rather than stretching the page. */}
        <aside className="hidden w-80 shrink-0 lg:block xl:w-96 2xl:w-[26rem]">
          <div className="surface-card h-full overflow-y-auto p-7">
            <FilterPanel />
          </div>
        </aside>

        <div ref={gridTopRef} className="min-w-0 flex-1 scroll-mt-24">
          {!loading && total === 0 ? (
            <EmptyState
              icon={<Icon name="noResults" />}
              title="Nothing matches those filters"
              description="Try removing a filter or two — there is plenty more in the collection."
              action={
                <Button type="primary" onClick={() => dispatch(clearFilters())}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ProductGrid products={products} loading={loading} />
          )}

          {total > PAGE_SIZE && (
            <div className="mt-10 flex justify-center">
              <Pagination
                current={page}
                total={total}
                pageSize={PAGE_SIZE}
                showSizeChanger={false}
                onChange={changePage}
              />
            </div>
          )}
        </div>
      </div>

      <Drawer
        title="Filters"
        placement="left"
        width={340}
        open={drawerOpen}
        onClose={() => dispatch(setFilterDrawer(false))}
      >
        <FilterPanel />
      </Drawer>
    </div>
  );
}
