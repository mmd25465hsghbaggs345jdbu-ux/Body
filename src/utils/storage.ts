import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

const STORAGE_KEY = 'bodyguard_menu_products_v1';

export function getStoredProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading products from storage:', e);
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    // Dispatch custom event for cross-tab or instant updates
    window.dispatchEvent(new Event('bodyguard_menu_updated'));
  } catch (e) {
    console.error('Error saving products to storage:', e);
  }
}
