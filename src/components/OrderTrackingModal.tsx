import React from 'react';
import {
  CheckCircle2,
  Clock,
  Bike,
  Store,
  Utensils,
  PhoneCall,
  X,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { Order } from '../types';
import { formatPrice, toPersianDigits } from '../utils/format';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const steps = [
    { id: 'step_1', title: 'ثبت و تایید سفارش', desc: 'سفارش شما در سیستم بادیگارد ثبت شد', active: true },
    { id: 'step_2', title: 'در حال آماده‌سازی', desc: 'اسکوپ‌زنی، آبگیری تازه و آماده‌سازی معجون', active: true },
    {
      id: 'step_3',
      title: order.orderType === 'delivery' ? 'در راه با پیک سریع' : 'آماده تحویل در کافه',
      desc: order.orderType === 'dine_in' ? `تحویل سر میز شماره ${toPersianDigits(order.tableNumber || '')}` : 'آماده تحویل',
      active: order.status === 'ready' || order.status === 'completed',
    },
    { id: 'step_4', title: 'نوش جان!', desc: 'تحویل داده شد', active: order.status === 'completed' },
  ];

  const getOrderTypeBadge = () => {
    switch (order.orderType) {
      case 'dine_in':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Utensils className="w-3.5 h-3.5 text-amber-700" />
            سرو در سالن • میز {toPersianDigits(order.tableNumber || 'نامشخص')}
          </span>
        );
      case 'takeaway':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
            <Store className="w-3.5 h-3.5 text-blue-700" />
            تحویل حضوری در شعبه (بیرون‌بر)
          </span>
        );
      case 'delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <Bike className="w-3.5 h-3.5 text-emerald-700" />
            ارسال با پیک ویژه بادیگارد
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="order-tracking-modal"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <PackageCheck className="w-6 h-6 text-amber-200" />
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20">
              سفارش با موفقیت ثبت شد
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-xl font-black">کد رهگیری سفارش:</h2>
              <div className="font-mono text-2xl font-black tracking-wider text-amber-100 mt-0.5">
                {order.orderNumber}
              </div>
            </div>

            <div className="text-left">
              <div className="text-xs text-white/80">زمان تخمینی:</div>
              <div className="text-lg font-black flex items-center gap-1 justify-end">
                <Clock className="w-4 h-4 text-amber-200" />
                <span>{toPersianDigits(order.estimatedMinutes)} دقیقه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Order Type & Status Pill */}
          <div className="flex items-center justify-between">
            {getOrderTypeBadge()}
            <span className="text-xs text-slate-500 font-medium">
              ثبت در ساعت: {order.createdAt}
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-900">وضعیت زنده سفارش:</h4>
            <div className="space-y-4 relative pr-2">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-start gap-3 relative">
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute right-3.5 top-7 w-0.5 h-8 ${
                        steps[idx + 1].active ? 'bg-amber-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition ${
                      step.active
                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                        : 'bg-white border-slate-300 text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2.5">اقلام سفارش داده شده:</h4>
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
              {order.items.map((it) => (
                <div key={it.cartId} className="flex justify-between items-center text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px] flex items-center justify-center">
                      {toPersianDigits(it.quantity)}
                    </span>
                    <span>{it.product.name}</span>
                    {it.selectedSize && (
                      <span className="text-[10px] text-slate-400">({it.selectedSize.name})</span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900">{formatPrice(it.totalPrice)}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>مبلغ نهایی پرداخت شده:</span>
                <span className="text-amber-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-center justify-between">
            <div className="text-xs text-amber-900">
              <div className="font-bold">نیاز به پیگیری یا تغییر سفارش دارید؟</div>
              <div className="text-[11px] text-amber-700">با همکاران ما در شعبه تماس بگیرید</div>
            </div>
            <a
              href="tel:02188889900"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>تماس فوری</span>
            </a>
          </div>
        </div>

        {/* Footer button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs transition shadow-sm"
          >
            متوجه شدم • بازگشت به منو
          </button>
        </div>
      </div>
    </div>
  );
};
