import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginPage } from './components/AdminLoginPage';
import { QrCodeModal } from './components/QrCodeModal';
import { Footer } from './components/Footer';

import { Product, CategoryId } from './types';
import { toPersianDigits } from './utils/format';
import { getStoredProducts, saveStoredProducts } from './utils/storage';
import { Sparkles, Flame, Leaf, UtensilsCrossed, ExternalLink, Settings } from 'lucide-react';

export default function App() {
  // Shared Products synced between customer menu and admin panel
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());

  // Routing State based on window.location.pathname or hash
  const [currentRoute, setCurrentRoute] = useState<'customer' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('#admin')) {
        return 'admin';
      }
    }
    return 'customer';
  });

  // Admin Auth state (session persistence)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('bodyguard_admin_auth') === 'true';
    }
    return false;
  });

  // Customer Menu UI State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSpecialFilter, setActiveSpecialFilter] = useState<'all' | 'special' | 'popular' | 'organic'>('all');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [tableNumber, setTableNumber] = useState<string>('');

  // Sync with URL and browser history (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('#admin')) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('customer');
      }
    };

    const handleStorageUpdate = () => {
      setProducts(getStoredProducts());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('bodyguard_menu_updated', handleStorageUpdate);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('bodyguard_menu_updated', handleStorageUpdate);
    };
  }, []);

  // Persist products whenever updated by admin
  const handleUpdateProductsState = (updatedList: Product[]) => {
    setProducts(updatedList);
    saveStoredProducts(updatedList);
  };

  // Product Operations (Admin)
  const handleToggleStock = (productId: string) => {
    const next = products.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    );
    handleUpdateProductsState(next);
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    const next = products.map((p) =>
      p.id === productId ? { ...p, basePrice: newPrice } : p
    );
    handleUpdateProductsState(next);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const next = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    handleUpdateProductsState(next);
  };

  const handleAddProduct = (newProduct: Product) => {
    const next = [newProduct, ...products];
    handleUpdateProductsState(next);
  };

  const handleDeleteProduct = (productId: string) => {
    const next = products.filter((p) => p.id !== productId);
    handleUpdateProductsState(next);
  };

  // Route Navigation Helpers
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentRoute('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCustomer = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('bodyguard_admin_auth', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('bodyguard_admin_auth');
    navigateToCustomer();
  };

  // Filtered Products for Customer Showcase
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (activeSpecialFilter === 'special' && !p.isSpecial) return false;
      if (activeSpecialFilter === 'popular' && !p.isPopular) return false;
      if (activeSpecialFilter === 'organic' && !p.isOrganic) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [products, selectedCategory, activeSpecialFilter, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: products.length,
      ice_cream_scoop: 0,
      ice_cream_bulk: 0,
      natural_juice: 0,
      majoon_vitamin: 0,
      shakes_smoothies: 0,
      waffles_desserts: 0,
      hot_drinks: 0,
    };

    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return counts;
  }, [products]);

  // ==========================================
  // VIEW 1: SEPARATE ADMIN VIEW (/admin)
  // ==========================================
  if (currentRoute === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage
          onLoginSuccess={handleAdminLoginSuccess}
          onGoToCustomerMenu={navigateToCustomer}
        />
      );
    }

    return (
      <AdminPanel
        products={products}
        onToggleStock={handleToggleStock}
        onUpdatePrice={handleUpdatePrice}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onLogout={handleAdminLogout}
        onNavigateToCustomerMenu={navigateToCustomer}
      />
    );
  }

  // ==========================================
  // VIEW 2: DEDICATED CUSTOMER MENU VIEW (/)
  // Completely clean, zero admin buttons/clutter
  // ==========================================
  return (
    <div className="min-h-screen bg-stone-50/50 text-slate-900 flex flex-col font-['Vazirmatn',sans-serif]">
      
      {/* Customer Header (No admin buttons) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenQr={() => setIsQrModalOpen(true)}
      />

      {/* Main Digital Showcase Menu */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Hero Showcase Banner */}
        <HeroBanner
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          onOpenQr={() => setIsQrModalOpen(true)}
        />

        {/* Categories Horizontal Bar */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* Special Dietary / Feature Quick Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">فیلتر سریع:</span>
            <button
              onClick={() => setActiveSpecialFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeSpecialFilter === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setActiveSpecialFilter('special')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeSpecialFilter === 'special'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>ویژه بادیگارد</span>
            </button>
            <button
              onClick={() => setActiveSpecialFilter('popular')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeSpecialFilter === 'popular'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <Flame className="w-3 h-3 text-orange-500" />
              <span>پرفروش‌ترین‌ها</span>
            </button>
            <button
              onClick={() => setActiveSpecialFilter('organic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeSpecialFilter === 'organic'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-500" />
              <span>۱۰۰٪ طبیعی</span>
            </button>
          </div>

          {/* Results count text */}
          <div className="text-xs text-slate-500">
            نمایش <span className="font-bold text-slate-800">{toPersianDigits(filteredProducts.length)}</span> محصول در منو
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">محصولی با این مشخصات یافت نشد</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              می‌توانید عبارت جستجو را پاک کنید یا دسته‌بندی دیگری از منو را انتخاب نمایید.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setActiveSpecialFilter('all');
              }}
              className="mt-4 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              نمایش تمام منو
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Flavor & Nutritional Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* QR Code Modal for Table Access / Printing */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        tableNumber={tableNumber}
        onSetTableNumber={setTableNumber}
      />

      {/* Discrete Manager Shortcut (Unobtrusive subtle link in the footer corner for owners) */}
      <div className="text-center py-2 bg-stone-900 text-[10px] text-stone-600 border-t border-stone-800/60">
        <button
          onClick={navigateToAdmin}
          className="hover:text-stone-400 transition inline-flex items-center gap-1 opacity-70 hover:opacity-100"
          title="ورود مدیریت کافه (/admin)"
        >
          <Settings className="w-3 h-3" />
          <span>پرتال مدیریت کافه</span>
        </button>
      </div>

      {/* Customer Footer */}
      <Footer onOpenQr={() => setIsQrModalOpen(true)} />
    </div>
  );
}
