import React, { useState } from 'react';
import {
  Search,
  Clock,
  QrCode,
  PhoneCall,
  X,
  MapPin
} from 'lucide-react';
import bodyguardLogo from '../assets/images/bodyguard_official_logo_1789721334072.jpg';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQr: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenQr,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header id="customer-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
      {/* Top micro-bar for branch status (Clean, zero admin hints) */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>منوی دیجیتال کافه بستنی و آبمیوه بادیگارد • پذیرایی در سالن و بیرون‌بر</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 opacity-90">
              <MapPin className="w-3 h-3 text-amber-200" />
              <span>خیابان ولیعصر، بالاتر از پارک ساعی</span>
            </span>
            <span className="opacity-50 hidden sm:inline">|</span>
            <a
              href="tel:02188889900"
              className="inline-flex items-center gap-1 font-mono hover:text-amber-200 font-bold"
              dir="ltr"
            >
              <PhoneCall className="w-3 h-3" />
              <span>021-88889900</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg shadow-amber-950/20 ring-3 ring-amber-500/60 bg-black flex items-center justify-center transition group-hover:scale-105">
                <img
                  src={bodyguardLogo}
                  alt="لوگوی آبمیوه بستنی بادیگارد"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  آبمیوه و بستنی <span className="text-amber-600">بادیگارد</span>
                </h1>
                <span className="hidden md:inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  منوی ویترینی سالن
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  اکنون باز است
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  ۱۰:۰۰ صبح الی ۲۴:۰۰ شب
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجوی پسته، زعفرانی، معجون، شیک، قهوه..."
                className="w-full h-11 pr-10 pl-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons for Customer */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition"
              title="جستجو در منو"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* QR Code Table Modal trigger */}
            <button
              id="qr-code-btn"
              onClick={onOpenQr}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition shadow-xs"
              title="بارکد منو روی میزهای کافه"
            >
              <QrCode className="w-4 h-4 text-amber-600" />
              <span>بارکد میزها</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {mobileSearchOpen && (
          <div className="lg:hidden pb-4 pt-1">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجوی طعم، بستنی، آبمیوه، معجون..."
                className="w-full h-11 pr-10 pl-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
