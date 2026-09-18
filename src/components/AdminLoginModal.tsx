import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '1234' || pin.trim() === '۱۲۳۴' || pin.trim() === '') {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('رمز عبور وارد شده نادرست است (رمز پیش‌فرض: ۱۲۳۴)');
    }
  };

  const handleQuickLogin = () => {
    setError('');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="admin-login-modal"
        className="relative w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">ورود به پنل مدیریت منو</h3>
            <p className="text-xs text-slate-400 mt-1">
              مدیریت و تغییر قیمت‌ها، کنترل موجودی طعم‌ها و ویرایش اقلام منو
            </p>
          </div>
        </div>

        {/* Default PIN Banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-purple-950/50 border border-purple-800/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-200">
            <KeyRound className="w-4 h-4 text-purple-400 shrink-0" />
            <span>رمز پیش‌فرض سیستم:</span>
          </div>
          <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-purple-800/60 text-purple-200 border border-purple-600/40">
            1234
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              رمز عبور مدیریت
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="رمز عبور را وارد کنید یا مستقیم دکمه زیر را بزنید"
              className="w-full h-11 px-4 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-center tracking-widest font-mono transition"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
            >
              <span>ورود به پنل مدیریت</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full h-10 bg-slate-800 hover:bg-slate-750 text-purple-300 hover:text-purple-200 rounded-xl text-xs font-semibold transition border border-slate-700"
            >
              ورود سریع مستقیم (به عنوان مدیر کافه)
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400">
          دسترسی ویژه سرپرست و پرسنل آبمیوه و بستنی بادیگارد
        </div>
      </div>
    </div>
  );
};
