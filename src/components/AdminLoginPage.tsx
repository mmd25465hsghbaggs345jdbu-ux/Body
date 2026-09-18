import React, { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import bodyguardLogo from '../assets/images/bodyguard_official_logo_1789721334072.jpg';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onGoToCustomerMenu: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onGoToCustomerMenu,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234
    if (pin.trim() === '1234' || pin.trim() === '123456') {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div id="admin-login-page" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-['Vazirmatn',sans-serif]">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Brand & Security Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full overflow-hidden shadow-2xl shadow-amber-950/50 ring-4 ring-amber-500/70 bg-black mx-auto">
              <img
                src={bodyguardLogo}
                alt="لوگوی رسمی کافه بادیگارد"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-amber-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              ورود به پنل مدیریت کافه بادیگارد
            </h2>
            <div className="text-xs text-amber-400/90 font-medium mt-0.5">
              Bodyguard Cafe & Juice Bar Admin
            </div>
          </div>
          <p className="text-xs text-slate-400">
            این بخش مختص مدیران و صندوقداران جهت ویرایش لحظه‌ای منو می‌باشد.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
              رمز عبور امنیتی مدیریت (PIN)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="رمز عبور ۴ رقمی (پیش‌فرض: 1234)"
                className="w-full h-12 pr-10 pl-10 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-center tracking-widest"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-1.5 text-right">
                رمز عبور نادرست است. رمز پیش‌فرض: <span className="font-mono font-bold">1234</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ورود به پنل ادمین</span>
          </button>
        </form>

        {/* Quick Demo Access & Back Link */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <button
            type="button"
            onClick={() => {
              setPin('1234');
              onLoginSuccess();
            }}
            className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-purple-300 hover:text-purple-200 rounded-xl text-xs font-semibold border border-purple-900/30 transition"
          >
            ورود سریع با رمز پیش‌فرض (۱۲۳۴)
          </button>

          <button
            type="button"
            onClick={onGoToCustomerMenu}
            className="w-full py-2 text-slate-400 hover:text-amber-400 text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به سایت و منوی مشتریان</span>
          </button>
        </div>

      </div>
    </div>
  );
};
