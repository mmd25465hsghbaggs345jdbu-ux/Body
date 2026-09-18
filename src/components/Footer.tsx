import React from 'react';
import { PhoneCall, MapPin, Clock, Heart, QrCode } from 'lucide-react';
import bodyguardLogo from '../assets/images/bodyguard_official_logo_1789721334072.jpg';

interface FooterProps {
  onOpenQr: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQr }) => {
  return (
    <footer id="customer-footer" className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16 font-['Vazirmatn',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-amber-950/40 ring-2 ring-amber-500/60 bg-black flex items-center justify-center shrink-0">
                <img
                  src={bodyguardLogo}
                  alt="لوگوی رسمی آبمیوه بستنی بادیگارد"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  بستنی و آبمیوه <span className="text-amber-400">بادیگارد</span>
                </h3>
                <span className="text-[11px] text-amber-200/80 font-medium">
                  Bodyguard Juice & Ice Cream
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              ارائه‌دهنده اصیل‌ترین بستنی‌های دست‌ساز سنتی با زعفران اعلای قائنات، آبمیوه‌های ۱۰۰٪ طبیعی بدون شکر افزوده و معجون‌های غلیظ مقوی با تازه‌ترین میوه‌های روز.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-amber-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>منوی دیجیتال ویترینی • پذیرایی در سالن و بسته‌بندی بیرون‌بر</span>
            </div>
          </div>

          {/* Col 2: Hours & Service */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>ساعات کاری و پذیرایی</span>
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>شنبه تا چهارشنبه:</span>
                <span className="text-slate-200 font-bold font-mono">۱۰:۰۰ الی ۲۴:۰۰</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>پنج‌شنبه و جمعه:</span>
                <span className="text-slate-200 font-bold font-mono">۱۰:۰۰ الی ۰۱:۰۰ بامداد</span>
              </div>
              <div className="flex justify-between py-1">
                <span>شیوه سفارش:</span>
                <span className="text-amber-400 font-semibold">مراجعه حضوری به سالن یا صندوق</span>
              </div>
            </div>
          </div>

          {/* Col 3: Address & Phone */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>شعبه مرکزی</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              تهران، خیابان ولیعصر، بالاتر از تقاطع پارک ساعی، پلاک ۱۲۴۰، کافه آبمیوه و بستنی بادیگارد
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:02188889900"
                className="inline-flex items-center gap-2 font-bold text-white hover:text-amber-400 transition font-mono"
                dir="ltr"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>021 - 8888 9900</span>
              </a>

              <button
                onClick={onOpenQr}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-300 text-xs transition mt-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>بارکد QR منوی میزها</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            تمامی حقوق متعلق به مجموعه آبمیوه و بستنی بادیگارد می‌باشد.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>طعم لحظه‌های شیرین شما با</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span className="font-bold text-amber-400">بادیگارد</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
