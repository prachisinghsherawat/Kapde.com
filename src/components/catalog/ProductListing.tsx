import { Badge, Button, Drawer, Pagination, Result, Select } from 'antd';
import { FilterOutlined, InboxOutlined } from '@ant-design/icons';

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

  return (
    <div className="container py-8 lg:py-10">
      <header className="mb-6">
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-80 shrink-0 xl:w-[22rem] lg:block">
          <div className="sticky top-24 surface-card p-6">
            <FilterPanel />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {loading ? 'Loading the collection…' : pluralize(total, 'product')}
            </p>

            <div className="flex items-center gap-2">
              {/* Hide the wrapper, not just the button — otherwise the badge floats
                  on its own once the sidebar takes over on large screens. */}
              <div className="lg:hidden">
                <Badge count={activeFilterCount} size="small" offset={[-2, 2]}>
                  <Button icon={<FilterOutlined />} onClick={() => dispatch(setFilterDrawer(true))}>
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

          <div className="mb-5 empty:mb-0">
            <ActiveFilterChips />
          </div>

          {!loading && total === 0 ? (
            <EmptyState
              icon={<InboxOutlined />}
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
                onChange={(next) => dispatch(setPage(next))}
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
