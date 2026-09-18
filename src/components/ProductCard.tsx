import React from 'react';
import { Star, Sparkles, Flame, Leaf, ChevronLeft, Info } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-amber-100/90 shadow-xs hover:shadow-xl hover:shadow-amber-900/5 hover:border-amber-300 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-40 group-hover:opacity-60 transition-opacity"></div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-start">
          {product.isSpecial && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-600 text-white shadow-sm backdrop-blur-xs">
              <Sparkles className="w-3 h-3" />
              ویژه بادیگارد
            </span>
          )}
          {product.isPopular && !product.isSpecial && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-orange-500 text-white shadow-sm backdrop-blur-xs">
              <Flame className="w-3 h-3" />
              پرفروش
            </span>
          )}
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-sm backdrop-blur-xs">
              <Leaf className="w-3 h-3" />
              ۱۰۰٪ طبیعی
            </span>
          )}
        </div>

        {/* Calories and Rating floating pill */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-[11px]">{toPersianDigits(product.rating)}</span>
            <span className="text-[10px] text-slate-300">({toPersianDigits(product.reviewCount)})</span>
          </div>

          {product.calories && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
              {toPersianDigits(product.calories)} کالری
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition line-clamp-1">
            {product.name}
          </h3>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5 mb-2 line-clamp-1" dir="ltr">
            {product.nameEn}
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Pricing & View Details Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-400">
              {product.availableSizes && product.availableSizes.length > 1 ? 'شروع قیمت از' : 'قیمت منو'}
            </div>
            <div className="text-sm sm:text-base font-black text-amber-700">
              {formatPrice(product.basePrice)}
            </div>
          </div>

          {product.inStock ? (
            <button
              id={`view-details-btn-${product.id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs"
            >
              <span>مشاهده طعم و ترکیبات</span>
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <span className="text-xs font-bold px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl">
              اتمام موجودی
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
