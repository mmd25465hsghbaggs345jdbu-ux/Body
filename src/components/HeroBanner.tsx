import React from 'react';
import { Sparkles, Flame, HeartHandshake, PhoneCall, QrCode, Award } from 'lucide-react';
import bodyguardLogo from '../assets/images/bodyguard_official_logo_1789721334072.jpg';

interface HeroBannerProps {
  onSelectCategory: (catId: any) => void;
  onOpenQr: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory, onOpenQr }) => {
  return (
    <div id="hero-banner-section" className="mb-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-black text-white p-6 sm:p-10 shadow-2xl shadow-amber-950/30 border border-amber-600/30">
        
        {/* Background decorative glow elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>منوی رسمی و ویترینی کافه بادیگارد</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-500/20 text-amber-200/90 text-xs">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>تازگی، انرژی، محافظ سلامتی شما</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-1">
              <div className="relative shrink-0 hidden sm:block">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-2xl ring-4 ring-amber-500/80 bg-black">
                  <img
                    src={bodyguardLogo}
                    alt="نشان رسمی کافه بادیگارد"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                  آبمیوه، بستنی دست‌ساز و معجون‌های غلیظ <span className="text-amber-400">بادیگارد</span>
                </h2>
                <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl leading-relaxed mt-2">
                  از پسته زعفرانی سلطنتی با زعفران قائنات تا آبمیوه‌های طبیعی بدون شکر افزوده؛ 
                  تمام اقلام با تازه‌ترین میوه‌ها در حضور شما آماده و سرو می‌گردد.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="pt-2 flex flex-wrap gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-amber-200">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>شیر تازه محلی و میوه ارگانیک</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-amber-200">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>معجون‌های پرانرژی چهارمغز</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-amber-200">
                <HeartHandshake className="w-4 h-4 text-amber-300" />
                <span>پذیرایی در سالن و بیرون‌بر</span>
              </div>
            </div>
          </div>

          {/* Quick Call & Table QR Card */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-sm bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/15 p-5 rounded-2xl text-center shadow-lg space-y-3">
              <div>
                <div className="text-xs font-medium text-amber-300 mb-1">
                  پشتیبانی و سفارش تلفنی مستقیم
                </div>
                <a
                  href="tel:02188889900"
                  className="inline-flex items-center justify-center gap-2 text-xl font-black text-white hover:text-amber-300 transition my-1 font-mono"
                  dir="ltr"
                >
                  <PhoneCall className="w-5 h-5 text-amber-400" />
                  <span>021 - 8888 9900</span>
                </a>
                <div className="text-[11px] text-slate-300">
                  ساعات پاسخگویی: ۱۰:۰۰ صبح الی ۲۴:۰۰ شب
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={onOpenQr}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 flex items-center justify-center gap-2 transition"
                >
                  <QrCode className="w-4 h-4" />
                  <span>نمایش بارکد دیجیتال میزها</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
