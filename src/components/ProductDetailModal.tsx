import React from 'react';
import {
  X,
  Star,
  Sparkles,
  ShieldCheck,
  Flame,
  Leaf,
  PhoneCall,
  Check,
  Utensils,
  Coffee
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils/format';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-100 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

          <div className="absolute bottom-4 right-4 left-4 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {product.isSpecial && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  پیشنهاد ویژه بادیگارد
                </span>
              )}
              {product.isOrganic && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  ۱۰۰٪ طبیعی
                </span>
              )}
              {product.calories && (
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                  {toPersianDigits(product.calories)} کالری
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{product.name}</h2>
            <div className="text-xs text-amber-200/90 font-medium mt-0.5" dir="ltr">
              {product.nameEn}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status & Base Price Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200/70">
            <div>
              <span className="text-xs text-slate-500 block">قیمت مصوب منو:</span>
              <span className="text-lg font-black text-amber-800">
                {formatPrice(product.basePrice)}
              </span>
            </div>
            <div>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Check className="w-3.5 h-3.5" />
                  موجود و تازه در شعبه
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  اتمام موجودی امروز
                </span>
              )}
            </div>
          </div>

          {/* Description & Recipe */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>ترکیبات و شیوه تهیه:</span>
            </h4>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {product.description}
            </div>
          </div>

          {/* Size / Portion Options */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-900 mb-2.5">
                سایزها و حجم‌های قابل سرو در سالن:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.availableSizes.map((size) => {
                  const calculatedPrice = Math.round(product.basePrice * size.priceMultiplier);
                  return (
                    <div
                      key={size.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{size.name}</div>
                        {size.description && (
                          <div className="text-[11px] text-slate-400">{size.description}</div>
                        )}
                      </div>
                      <div className="text-xs font-black text-amber-700">
                        {formatPrice(calculatedPrice)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Toppings */}
          {product.availableToppings && product.availableToppings.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-900 mb-2">
                تاپینگ‌ها و افزودنی‌های دلخواه (قابل انتخاب سر میز یا پای صندوق):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.availableToppings.map((topping) => (
                  <div
                    key={topping.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-700">{topping.name}</span>
                    <span className="font-bold text-slate-900">
                      +{formatPrice(topping.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order in-person notice */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-amber-950 text-white text-xs space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>نحوه سفارش و سرویس‌دهی:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              این منو به صورت ویترینی جهت مشاهده مشخصات، طعم‌ها و قیمت‌های به‌روز می‌باشد. جهت ثبت سفارش، لطفاً به صندوق کافه مراجعه فرمایید یا به پرسنل محترم سالن اعلام فرمایید.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <a
            href="tel:02188889900"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>تماس با شعبه کافه</span>
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
          >
            بستن منو
          </button>
        </div>
      </div>
    </div>
  );
};
