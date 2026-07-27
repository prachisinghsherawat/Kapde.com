import type { CSSProperties } from 'react';
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  FacebookOutlined,
  FileSearchOutlined,
  FilterOutlined,
  HeartFilled,
  HeartOutlined,
  InstagramOutlined,
  LeftOutlined,
  LockOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  MinusOutlined,
  MoonOutlined,
  PhoneOutlined,
  PictureOutlined,
  PlusOutlined,
  RightOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  SearchOutlined,
  ShoppingOutlined,
  StarFilled,
  SunOutlined,
  TruckOutlined,
  UserOutlined,
  XOutlined,
} from '@ant-design/icons';

/**
 * Single source of truth for iconography. Two rules keep the set coherent:
 *
 *  1. One family — outlined everywhere. A filled glyph is reserved for an "on"
 *     state (a saved wishlist item, an earned rating star), never decoration.
 *  2. One size scale — call sites pick a step instead of a raw pixel value, so
 *     an icon sitting next to 14px body copy is the same size app-wide.
 */
export const ICON_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
} as const;

export type IconSize = keyof typeof ICON_SIZE;

/**
 * Semantic name → glyph. Change what an icon *means* here, not at call sites;
 * swapping the whole set later is then a single edit to this map.
 */
export const ICONS = {
  // Navigation & chrome
  menu: MenuOutlined,
  search: SearchOutlined,
  account: UserOutlined,
  logout: LogoutOutlined,
  themeDark: MoonOutlined,
  themeLight: SunOutlined,

  // Commerce
  bag: ShoppingOutlined,
  wishlist: HeartOutlined,
  wishlistOn: HeartFilled,
  rating: StarFilled,
  remove: DeleteOutlined,
  increment: PlusOutlined,
  decrement: MinusOutlined,

  // Catalogue
  filter: FilterOutlined,
  selected: CheckOutlined,
  noResults: FileSearchOutlined,
  imageFallback: PictureOutlined,

  // Direction
  arrowRight: ArrowRightOutlined,
  chevronLeft: LeftOutlined,
  chevronRight: RightOutlined,

  // Trust & reassurance
  shipping: TruckOutlined,
  returns: RollbackOutlined,
  secure: SafetyCertificateOutlined,
  guarantee: SafetyOutlined,
  inStock: CheckCircleOutlined,
  card: CreditCardOutlined,
  lock: LockOutlined,

  // Contact & social
  mail: MailOutlined,
  phone: PhoneOutlined,
  instagram: InstagramOutlined,
  x: XOutlined,
  facebook: FacebookOutlined,
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  /**
   * Omit to inherit the surrounding font-size — correct inside antd Buttons,
   * Inputs and Result, which already size their own icons.
   */
  size?: IconSize;
  className?: string;
  style?: CSSProperties;
};

/** Decorative by default: every call site pairs it with a label or nearby text. */
export default function Icon({ name, size, className, style }: IconProps) {
  const Glyph = ICONS[name];

  return (
    <Glyph
      aria-hidden
      className={className ? `shrink-0 ${className}` : 'shrink-0'}
      style={size ? { fontSize: ICON_SIZE[size], ...style } : style}
    />
  );
}
