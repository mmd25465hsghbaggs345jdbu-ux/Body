export type CategoryId =
  | 'all'
  | 'ice_cream_scoop'
  | 'ice_cream_bulk'
  | 'natural_juice'
  | 'majoon_vitamin'
  | 'shakes_smoothies'
  | 'waffles_desserts'
  | 'hot_drinks';

export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  iconName: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface ProductSize {
  id: string;
  name: string;
  priceMultiplier: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryId;
  basePrice: number;
  description: string;
  image: string;
  isPopular?: boolean;
  isSpecial?: boolean;
  isOrganic?: boolean;
  calories?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  availableSizes?: ProductSize[];
  availableToppings?: Topping[];
  sweetnessLevels?: string[];
}

export interface CartItem {
  cartId: string;
  product: Product;
  selectedSize?: ProductSize;
  selectedToppings: Topping[];
  sweetnessLevel?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  tableNumber?: string;
  address?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  paymentMethod: 'online' | 'cash_card_on_delivery';
}
