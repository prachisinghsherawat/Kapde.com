import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Badge, Drawer, Dropdown, Input, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  HeartOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  SearchOutlined,
  ShoppingOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout, selectUser } from '@/features/auth/authSlice';
import { selectCartCount } from '@/features/cart/cartSlice';
import { selectWishlistCount } from '@/features/wishlist/wishlistSlice';
import { selectTheme, toggleTheme } from '@/features/ui/uiSlice';
import { CATEGORIES } from '@/lib/constants';

/** Shared shape for the header action icons: large tap target, hover lift, brand tint. */
const iconButtonClass =
  'group/icon grid h-11 w-11 place-items-center rounded-full text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-subtle active:translate-y-0';

/** First letters of the first two words, e.g. "Priya Sharma" → "PS". */
const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('') || 'U';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative cursor-pointer py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-600 after:transition-transform hover:text-brand-600 hover:after:scale-x-100 ${
    isActive ? 'text-brand-600 after:scale-x-100' : 'text-ink'
  }`;



export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const theme = useAppSelector(selectTheme);
  const user = useAppSelector(selectUser);

  const [menuOpen, setMenuOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (value: string) => {
    const query = value.trim();
    if (!query) return;
    setMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const accountMenu: MenuProps['items'] = user
    ? [
        { key: 'name', label: <span className="font-medium">{user.name}</span>, disabled: true },
        { type: 'divider' },
        { key: 'wishlist', label: <Link to="/wishlist">Wishlist</Link> },
        { key: 'cart', label: <Link to="/cart">My bag</Link> },
        { type: 'divider' },
        {
          key: 'logout',
          danger: true,
          icon: <LogoutOutlined />,
          label: 'Log out',
          onClick: () => dispatch(logout()),
        },
      ]
    : [
        { key: 'login', label: <Link to="/login">Log in</Link> },
        { key: 'signup', label: <Link to="/signup">Create account</Link> },
      ];

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? 'border-line bg-surface/85 backdrop-blur-lg' : 'border-transparent bg-surface'
      }`}
    >
      <div className="container flex h-16 items-center gap-4">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className={`${iconButtonClass} lg:hidden`}
        >
          <MenuOutlined className="text-[22px] text-ink" />
        </button>

        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-ink">
          Kapde<span className="text-brand-600">.</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-4 lg:flex xl:gap-5">
          {CATEGORIES.map((category) => (
            <NavLink key={category.slug} to={`/c/${category.slug}`} className={navLinkClass}>
              {category.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Input
            allowClear
            value={term}
            placeholder="Search for jeans, dresses…"
            prefix={<SearchOutlined className="text-muted" />}
            onChange={(event) => setTerm(event.target.value)}
            onPressEnter={(event) => submitSearch(event.currentTarget.value)}
            className="hidden w-56 md:flex xl:w-72"
            aria-label="Search products"
          />

          <Tooltip title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
            <button
              type="button"
              aria-label="Toggle colour theme"
              onClick={() => dispatch(toggleTheme())}
              className={iconButtonClass}
            >
              <span className="text-[22px] text-ink transition-colors group-hover/icon:text-brand-600">
                {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              </span>
            </button>
          </Tooltip>

          <Tooltip title="Wishlist">
            <Link to="/wishlist" aria-label="Wishlist" className={iconButtonClass}>
              <Badge count={wishlistCount} size="small" offset={[-2, 2]}>
                <HeartOutlined className="text-[22px] text-ink transition-colors group-hover/icon:text-brand-600" />
              </Badge>
            </Link>
          </Tooltip>

          <Tooltip title="Shopping bag">
            <Link to="/cart" aria-label="Shopping bag" className={iconButtonClass}>
              <Badge count={cartCount} size="small" offset={[-2, 2]}>
                <ShoppingOutlined className="text-[22px] text-ink transition-colors group-hover/icon:text-brand-600" />
              </Badge>
            </Link>
          </Tooltip>

          <Dropdown menu={{ items: accountMenu }} placement="bottomRight" trigger={['click']}>
            <button type="button" aria-label="Account" className={iconButtonClass}>
              {user ? (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white transition-transform group-hover/icon:scale-105">
                  {initials(user.name)}
                </span>
              ) : (
                <UserOutlined className="text-[22px] text-ink transition-colors group-hover/icon:text-brand-600" />
              )}
            </button>
          </Dropdown>
        </div>
      </div>

      <Drawer
        title="Kapde"
        placement="left"
        width={280}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Input.Search
          placeholder="Search products"
          onSearch={submitSearch}
          className="mb-6"
          allowClear
        />
        <nav className="flex flex-col">
          {CATEGORIES.map((category) => (
            <NavLink
              key={category.slug}
              to={`/c/${category.slug}`}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block border-b border-line py-3 text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-600' : 'text-ink hover:text-brand-600'
                }`
              }
            >
              {category.label}
            </NavLink>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
