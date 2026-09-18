import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  DollarSign,
  Save,
  X,
  QrCode,
  Store,
  PhoneCall,
  Clock,
  Sparkles,
  Flame,
  Leaf,
  Layers,
  Check,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Product, CategoryId } from '../types';
import { CATEGORIES } from '../data/mockProducts';
import { formatPrice, toPersianDigits } from '../utils/format';
import { processImageUpload } from '../utils/imageUpload';
import bodyguardLogo from '../assets/images/bodyguard_official_logo_1789721334072.jpg';

interface AdminPanelProps {
  products: Product[];
  onToggleStock: (productId: string) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onLogout: () => void;
  onNavigateToCustomerMenu: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onToggleStock,
  onUpdatePrice,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onLogout,
  onNavigateToCustomerMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'new_product' | 'branch_info' | 'qr_menu'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  
  // Quick price edit state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Full product edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryId>('ice_cream_scoop');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCalories, setNewProdCalories] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80');
  const [isUploadingNewImage, setIsUploadingNewImage] = useState(false);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);
  const [newProdIsSpecial, setNewProdIsSpecial] = useState(false);
  const [newProdIsPopular, setNewProdIsPopular] = useState(false);
  const [newProdIsOrganic, setNewProdIsOrganic] = useState(false);

  // Branch Info State
  const [branchPhone, setBranchPhone] = useState('021-88889900');
  const [branchAddress, setBranchAddress] = useState('تهران، خیابان ولیعصر، بالاتر از تقاطع پارک ساعی، پلاک ۱۲۴۰');
  const [branchHours, setBranchHours] = useState('همه روزه از ۱۰:۰۰ الی ۲۴:۰۰ (پنج‌شنبه و جمعه تا ۰۱:۰۰ بامداد)');
  const [announcement, setAnnouncement] = useState('منوی ویژه بهار و تابستان با بستنی‌های دست‌ساز تازه و میوه‌های فصل');
  const [isSavedInfo, setIsSavedInfo] = useState(false);

  // Stats calculation
  const totalItemsCount = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePriceSave = (productId: string) => {
    const val = parseInt(tempPrice.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      onUpdatePrice(productId, val);
    }
    setEditingPriceId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice.trim()) {
      alert('لطفاً نام و قیمت محصول را وارد نمایید.');
      return;
    }

    const price = parseInt(newProdPrice.replace(/[^0-9]/g, ''), 10) || 100000;
    const calories = newProdCalories ? parseInt(newProdCalories, 10) : undefined;

    const newProd: Product = {
      id: `prod_custom_${Date.now()}`,
      name: newProdName,
      nameEn: newProdNameEn || 'Artisanal Selection',
      category: newProdCategory,
      basePrice: price,
      description: newProdDesc || 'تهیه شده از تازه‌ترین مواد اولیه درجه یک در کافه بادیگارد.',
      image: newProdImage || 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      calories,
      isSpecial: newProdIsSpecial,
      isPopular: newProdIsPopular,
      isOrganic: newProdIsOrganic,
    };

    onAddProduct(newProd);
    alert('محصول جدید با موفقیت به منو اضافه شد.');
    setNewProdName('');
    setNewProdNameEn('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdCalories('');
    setNewProdIsSpecial(false);
    setNewProdIsPopular(false);
    setNewProdIsOrganic(false);
    setActiveTab('products');
  };

  const handleFileUploadForNewProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingNewImage(true);
      const dataUrl = await processImageUpload(file);
      setNewProdImage(dataUrl);
    } catch (err: any) {
      alert(err.message || 'خطا در بارگذاری تصویر');
    } finally {
      setIsUploadingNewImage(false);
      e.target.value = '';
    }
  };

  const handleFileUploadForEditProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    try {
      setIsUploadingEditImage(true);
      const dataUrl = await processImageUpload(file);
      setEditingProduct({
        ...editingProduct,
        image: dataUrl,
      });
    } catch (err: any) {
      alert(err.message || 'خطا در بارگذاری تصویر');
    } finally {
      setIsUploadingEditImage(false);
      e.target.value = '';
    }
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  return (
    <div id="admin-panel-standalone" className="bg-slate-950 text-slate-100 min-h-screen py-6 px-4 sm:px-6 font-['Vazirmatn',sans-serif]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top bar with Admin Title, Customer Menu Link and Logout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-xl ring-3 ring-amber-500/70 bg-black flex items-center justify-center shrink-0">
              <img
                src={bodyguardLogo}
                alt="لوگوی رسمی کافه بادیگارد"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  پنل مدیریت مرکزی کافه بادیگارد
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  ورود ادمین
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                تغییر لحظه‌ای قیمت‌ها، موجودی طعم‌ها و ثبت محصولات منوی دیجیتال
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onNavigateToCustomerMenu}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              <Eye className="w-4 h-4" />
              <span>مشاهده سایت مشتریان</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 transition"
              title="خروج از پنل مدیریت"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">کل اقلام منو</div>
              <div className="text-base sm:text-lg font-black text-white">
                {toPersianDigits(totalItemsCount)} محصول
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">اقلام موجود و فعال</div>
              <div className="text-base sm:text-lg font-black text-emerald-400">
                {toPersianDigits(inStockCount)} محصول
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">اقلام ناموجود (تمام شده)</div>
              <div className="text-base sm:text-lg font-black text-rose-400">
                {toPersianDigits(outOfStockCount)} آیتم
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">دسته‌بندی‌های منو</div>
              <div className="text-base sm:text-lg font-black text-amber-400">
                {toPersianDigits(CATEGORIES.length - 1)} دسته اصلی
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>مدیریت محصولات و تغییر سریع قیمت‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('new_product')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'new_product'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>افزودن محصول جدید به منو</span>
          </button>

          <button
            onClick={() => setActiveTab('branch_info')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'branch_info'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>اطلاعات شعبه و ساعات کاری</span>
          </button>

          <button
            onClick={() => setActiveTab('qr_menu')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'qr_menu'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>بارکد QR منوی میزها</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS & PRICES MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="جستجوی محصول جهت ویرایش یا تغییر قیمت..."
                  className="w-full h-10 pr-10 pl-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-slate-400 shrink-0">دسته:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="h-10 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">همه دسته‌بندی‌ها</option>
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setActiveTab('new_product')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>محصول جدید</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs sm:text-sm">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">محصول</th>
                      <th className="py-3 px-4">دسته‌بندی</th>
                      <th className="py-3 px-4">قیمت فعلی (تومان)</th>
                      <th className="py-3 px-4">وضعیت موجودی</th>
                      <th className="py-3 px-4 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.map((p) => {
                      const isEditingPrice = editingPriceId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition">
                          {/* Product Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{p.name}</span>
                                  {p.isSpecial && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                      ویژه
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono" dir="ltr">
                                  {p.nameEn}
                                </div>
                                {p.calories && (
                                  <div className="text-[10px] text-amber-400/80">
                                    {toPersianDigits(p.calories)} کالری
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 text-slate-300">
                            {CATEGORIES.find((c) => c.id === p.category)?.title || p.category}
                          </td>

                          {/* Quick Price Editor */}
                          <td className="py-3.5 px-4">
                            {isEditingPrice ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={tempPrice}
                                  onChange={(e) => setTempPrice(e.target.value)}
                                  className="w-28 h-8 px-2 text-xs bg-slate-950 border border-purple-500 rounded-lg text-white font-mono"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handlePriceSave(p.id);
                                    if (e.key === 'Escape') setEditingPriceId(null);
                                  }}
                                />
                                <button
                                  onClick={() => handlePriceSave(p.id)}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                                  title="ذخیره قیمت"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingPriceId(null)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                                  title="انصراف"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-amber-400 font-mono">
                                  {formatPrice(p.basePrice)}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingPriceId(p.id);
                                    setTempPrice(p.basePrice.toString());
                                  }}
                                  className="p-1 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-md transition"
                                  title="تغییر سریع قیمت"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Stock Toggle */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => onToggleStock(p.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                                p.inStock
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  p.inStock ? 'bg-emerald-400' : 'bg-rose-400'
                                }`}
                              ></span>
                              <span>{p.inStock ? 'موجود در شعبه' : 'اتمام موجودی'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-left">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct({ ...p })}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>ویرایش کامل</span>
                              </button>
                              <button
                                onClick={() => setProductToDelete(p)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
                                title="حذف از منو"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW PRODUCT */}
        {activeTab === 'new_product' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8">
            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>افزودن طعم یا محصول جدید به منوی کافه بادیگارد</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              اطلاعات محصول را وارد نمایید تا بلافاصله در منوی دیجیتال مشتریان نمایش داده شود.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-5 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    نام فارسی محصول *
                  </label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="مثال: بستنی پسته زعفرانی دوبل"
                    className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    نام انگلیسی (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={newProdNameEn}
                    onChange={(e) => setNewProdNameEn(e.target.value)}
                    placeholder="مثال: Double Pistachio Saffron"
                    className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-left font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    دسته‌بندی منو *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as CategoryId)}
                    className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    قیمت به تومان *
                  </label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="مثال: 120000"
                    className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    کالری تخمینی (اختیاری)
                  </label>
                  <input
                    type="number"
                    value={newProdCalories}
                    onChange={(e) => setNewProdCalories(e.target.value)}
                    placeholder="مثال: 260"
                    className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              {/* Product Image Input & Upload */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-slate-300">
                  تصویر محصول (آپلود فایل مستقیم از گالری یا وارد کردن لینک اینترنتی)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8 space-y-2">
                    {/* File Upload Input */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="new-product-file-upload"
                        onChange={handleFileUploadForNewProduct}
                        className="hidden"
                      />
                      <label
                        htmlFor="new-product-file-upload"
                        className="flex items-center justify-center gap-2 w-full h-11 px-4 text-xs font-bold rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/40 cursor-pointer transition active:scale-95 shadow-sm"
                      >
                        <Upload className="w-4 h-4 text-purple-400" />
                        <span>{isUploadingNewImage ? 'در حال بهینه‌سازی و آپلود...' : 'انتخاب و آپلود عکس از دستگاه / گالری'}</span>
                      </label>
                    </div>

                    {/* Or URL */}
                    <div className="relative">
                      <input
                        type="text"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="یا آدرس تصویر اینترنتی (URL) را اینجا وارد کنید..."
                        className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="sm:col-span-4 flex items-center justify-center">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group">
                      {newProdImage ? (
                        <img
                          src={newProdImage}
                          alt="پیش‌نمایش تصویر"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-700" />
                      )}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white">
                        پیش‌نمایش
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  توضیحات، ترکیبات و شیوه سرو
                </label>
                <textarea
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  rows={3}
                  placeholder="توضیحاتی در مورد طعم، میوه‌ها یا مغزیجات به کار رفته در این آیتم..."
                  className="w-full p-3.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Special Badges Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsSpecial}
                    onChange={(e) => setNewProdIsSpecial(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-800"
                  />
                  <span>پیشنهاد ویژه بادیگارد</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsPopular}
                    onChange={(e) => setNewProdIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-800"
                  />
                  <span>پرفروش‌ترین منو</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsOrganic}
                    onChange={(e) => setNewProdIsOrganic(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-800"
                  />
                  <span>۱۰۰٪ طبیعی و بدون شکر</span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>ثبت و اضافه کردن به منو</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BRANCH SETTINGS & ANNOUNCEMENTS */}
        {activeTab === 'branch_info' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 max-w-3xl">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <span>تنظیمات شعبه و پیام خوش‌آمدگویی منو</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                اطلاعات تماس، ساعات کاری و آدرس مندرج در منوی دیجیتال مشتریان
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  شماره تماس پشتیبانی و سفارش تلفنی شعبه
                </label>
                <input
                  type="text"
                  value={branchPhone}
                  onChange={(e) => setBranchPhone(e.target.value)}
                  className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  آدرس دقیق شعبه
                </label>
                <input
                  type="text"
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ساعات کاری و پذیرایی کافه
                </label>
                <input
                  type="text"
                  value={branchHours}
                  onChange={(e) => setBranchHours(e.target.value)}
                  className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  متن بنر ویژه / اطلاعیه به مشتریان
                </label>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  rows={2}
                  className="w-full p-3 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSavedInfo(true);
                    setTimeout(() => setIsSavedInfo(false), 3000);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره تنظیمات شعبه</span>
                </button>

                {isSavedInfo && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>تغییرات با موفقیت ذخیره شد.</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QR CODE FOR TABLES */}
        {activeTab === 'qr_menu' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 max-w-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                بارکد QR اختصاصی منوی دیجیتال کافه بادیگارد
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                این بارکد را چاپ نموده و روی استندهای میزهای سالن کافه بادیگارد قرار دهید تا مشتریان به راحتی با اسکن دوربین گوشی خود، منو و لیست قیمت‌ها را مشاهده کنند.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl inline-block shadow-2xl border-4 border-amber-400 mx-auto">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://bodyguard-cafe.ir/menu"
                alt="QR Code"
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
              />
              <div className="mt-3 text-slate-900 font-black text-sm">
                آبمیوه و بستنی بادیگارد
              </div>
              <div className="text-[11px] text-slate-500">
                منوی دیجیتال ویترینی و قیمت‌ها
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md"
              >
                چاپ استند روی میز
              </button>
            </div>
          </div>
        )}

        {/* MODAL: EDIT PRODUCT DETAILS */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-purple-400" />
                  <span>ویرایش کامل محصول: {editingProduct.name}</span>
                </h4>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">نام فارسی:</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">نام انگلیسی:</label>
                  <input
                    type="text"
                    value={editingProduct.nameEn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-left"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">قیمت به تومان:</label>
                    <input
                      type="number"
                      value={editingProduct.basePrice}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, basePrice: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full h-10 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">کالری:</label>
                    <input
                      type="number"
                      value={editingProduct.calories || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          calories: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        })
                      }
                      className="w-full h-10 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">توضیحات و ترکیبات:</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    rows={3}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none"
                  />
                </div>

                {/* Image Edit & Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    عکس محصول (آپلود مستقیم یا تغییر لینک):
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8 space-y-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          id="edit-product-file-upload"
                          onChange={handleFileUploadForEditProduct}
                          className="hidden"
                        />
                        <label
                          htmlFor="edit-product-file-upload"
                          className="flex items-center justify-center gap-2 w-full h-10 px-3 text-xs font-bold rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/40 cursor-pointer transition active:scale-95 shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5 text-purple-400" />
                          <span>{isUploadingEditImage ? 'در حال آپلود و پردازش...' : 'آپلود عکس جدید از حافظه دستگاه'}</span>
                        </label>
                      </div>

                      <input
                        type="text"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        className="w-full h-9 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-left text-xs"
                        placeholder="یا لینک تصویر اینترنتی..."
                        dir="ltr"
                      />
                    </div>

                    <div className="sm:col-span-4 flex items-center justify-center">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
                        {editingProduct.image ? (
                          <img
                            src={editingProduct.image}
                            alt={editingProduct.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-600" />
                        )}
                        <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] text-white">
                          پیش‌نمایش
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isSpecial || false}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isSpecial: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700"
                    />
                    <span>پیشنهاد ویژه</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isPopular || false}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isPopular: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700"
                    />
                    <span>پرفروش</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isOrganic || false}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isOrganic: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700"
                    />
                    <span>۱۰۰٪ طبیعی</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const target = editingProduct;
                      setEditingProduct(null);
                      setProductToDelete(target);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 flex items-center gap-1.5 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>حذف این محصول</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-md shadow-purple-600/30"
                    >
                      ذخیره تغییرات
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRM PRODUCT DELETION */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border border-rose-900/40 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    تأیید حذف محصول از منو
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    آیا از حذف آیتم زیر مطمئن هستید؟ این محصول بلافاصله از دید مشتریان خارج خواهد شد.
                  </p>
                </div>
              </div>

              {/* Product preview summary */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <img
                  src={productToDelete.image}
                  alt={productToDelete.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {productToDelete.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono" dir="ltr">
                    {productToDelete.nameEn}
                  </p>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">
                    {formatPrice(productToDelete.basePrice)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  انصراف و لغو
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = productToDelete.id;
                    const name = productToDelete.name;
                    onDeleteProduct(id);
                    setProductToDelete(null);
                    setActionNotice(`محصول «${name}» با موفقیت از منو حذف شد.`);
                    setTimeout(() => setActionNotice(null), 3500);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-rose-600/30 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>بله، حذف قطعی محصول</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Toast / Action Notice */}
        {actionNotice && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
        )}

      </div>
    </div>
  );
};
