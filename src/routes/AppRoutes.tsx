import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PageLoader from '@/components/common/PageLoader';
import ScrollToTop from '@/components/common/ScrollToTop';
import RequireAuth from '@/routes/RequireAuth';

const HomePage = lazy(() => import('@/pages/HomePage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/c/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route path="/order-confirmed" element={<OrderSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Legacy paths from the previous version of the site. Categories that no
              longer exist land on search rather than a dead end. */}
          <Route path="/tops" element={<Navigate to="/c/tops" replace />} />
          <Route path="/kurtis" element={<Navigate to="/search?q=dress" replace />} />
          <Route path="/frocks" element={<Navigate to="/c/womens-dresses" replace />} />
          <Route path="/middis" element={<Navigate to="/c/womens-dresses" replace />} />
          <Route path="/denims" element={<Navigate to="/c/mens-shirts" replace />} />
          <Route path="/jackets" element={<Navigate to="/c/mens-shirts" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
