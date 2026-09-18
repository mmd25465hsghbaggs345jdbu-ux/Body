import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Bike,
  Store,
  Utensils,
  Tag,
  CheckCircle2,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { CartItem, OrderType, Order } from '../types';
import { formatPrice, toPersianDigits, generateOrderNumber } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, qty: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  tableNumber: string;
  onSetTableNumber: (tbl: string) => void;
  onOrderCompleted: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  tableNumber,
  onSetTableNumber,
  onOrderCompleted,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash_card_on_delivery'>('online');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const deliveryFee = orderType === 'delivery' ? 35000 : 0;
  const finalTotal = subtotal - discountAmount + deliveryFee;

  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'BODYGUARD10' || code === 'BODYGUARD' || code === 'بادیگارد') {
      setDiscountPercent(10);
      setCouponSuccess('تخفیف ۱۰٪ ویژه بادیگارد اعمال شد!');
    } else if (code === 'SWEET20') {
      setDiscountPercent(20);
      setCouponSuccess('تخفیف ۲۰٪ ویژه مشتریان وفادار اعمال شد!');
    } else {
      setCouponError('کد تخفیف معتبر نیست (کد تست: BODYGUARD10)');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    if (!customerPhone.trim()) {
      alert('لطفاً شماره تماس خود را وارد نمایید.');
      return;
    }

    if (orderType === 'dine_in' && !tableNumber) {
      alert('لطفاً شماره میز خود را وارد یا انتخاب نمایید.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('لطفاً آدرس دقیق برای ارسال پیک را وارد نمایید.');
      return;
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: generateOrderNumber(),
      customerName: customerName || 'مشتری گرامی',
      customerPhone,
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      address: orderType === 'delivery' ? deliveryAddress : undefined,
      items: [...items],
      subtotal,
      discount: discountAmount,
      tax: 0,
      deliveryFee,
      total: finalTotal,
      status: 'preparing',
      createdAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: orderType === 'delivery' ? 30 : 15,
      paymentMethod,
    };

    onOrderCompleted(newOrder);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        id="cart-drawer-panel"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base text-slate-900">سبد سفارشات شما</h2>
              <div className="text-xs text-slate-500">
                {items.length > 0
                  ? `${toPersianDigits(items.length)} آیتم انتخاب شده`
                  : 'سبد خالی است'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">سبد خرید شما خالی است</h3>
            <p className="text-xs text-slate-500 max-w-xs mb-6">
              طعم مورد علاقه خود را از میان بستنی‌ها، آبمیوه‌ها یا معجون‌های بادیگارد انتخاب کنید.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/20"
            >
              مشاهده منو و سفارش
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartId}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Size & Toppings summary */}
                    <div className="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                      {item.selectedSize && (
                        <div>حجم: <span className="text-slate-700 font-medium">{item.selectedSize.name}</span></div>
                      )}
                      {item.selectedToppings.length > 0 && (
                        <div>
                          تاپینگ: <span className="text-amber-800 font-medium">
                            {item.selectedToppings.map((t) => t.name).join('، ')}
                          </span>
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-slate-400 italic">یادداشت: {item.notes}</div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                          className="text-slate-500 hover:text-amber-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {toPersianDigits(item.quantity)}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                          className="text-slate-500 hover:text-amber-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-black text-slate-900">
                        {formatPrice(item.totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Type Selector */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-900">
                نحوه دریافت سفارش:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    orderType === 'dine_in'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Utensils className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs">سرو در سالن</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    orderType === 'takeaway'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Store className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs">تحویل حضوری</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                    orderType === 'delivery'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Bike className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs">ارسال با پیک</span>
                </button>
              </div>

              {/* Conditional Table input */}
              {orderType === 'dine_in' && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    شماره میز شما در کافه بادیگارد:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={tableNumber}
                      onChange={(e) => onSetTableNumber(e.target.value)}
                      placeholder="مثال: ۷"
                      className="w-24 px-3 py-1.5 text-center text-sm font-bold bg-white border border-amber-300 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                    <span className="text-xs text-amber-800">
                      (سفارش مستقیماً به سر میز شما آورده می‌شود)
                    </span>
                  </div>
                </div>
              )}

              {/* Conditional Address input */}
              {orderType === 'delivery' && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2">
                  <label className="block text-xs font-bold text-amber-950">
                    آدرس دقیق تحویل:
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="خیابان، پلاک، واحد، زنگ..."
                    className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                  <div className="text-[11px] text-amber-700 flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5" />
                    <span>هزینه پیک مخصوص آبمیوه و بستنی: ۳۵,۰۰۰ تومان</span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="محمد حسینی"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">شماره تماس (الزامی):</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none text-right"
                />
              </div>
            </div>

            {/* Coupon Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>کد تخفیف:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="کد تخفیف (مثال: BODYGUARD10)"
                  dir="ltr"
                  className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
                >
                  اعمال
                </button>
              </div>

              {couponSuccess && (
                <div className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{couponSuccess}</span>
                </div>
              )}
              {couponError && (
                <div className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{couponError}</span>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>جمع کل اقلام:</span>
                <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>تخفیف ویژه ({toPersianDigits(discountPercent)}٪):</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>هزینه پیک بادیگارد:</span>
                  <span className="font-bold text-slate-900">{formatPrice(deliveryFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="text-amber-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shadow-lg">
            <button
              id="confirm-checkout-btn"
              onClick={handleCheckout}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold flex items-center justify-between px-5 shadow-lg shadow-orange-500/20 active:scale-98 transition text-sm"
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>تأیید و ثبت نهایی سفارش</span>
              </span>
              <span className="font-black text-white/95">
                {formatPrice(finalTotal)}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
