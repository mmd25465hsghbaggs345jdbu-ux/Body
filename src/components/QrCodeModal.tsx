import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Printer } from 'lucide-react';
import { toPersianDigits } from '../utils/format';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  onSetTableNumber: (tbl: string) => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
  onSetTableNumber,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    tableNumber ? `${currentUrl}?table=${tableNumber}` : currentUrl
  )}&bgcolor=fffbeb&color=78350f&margin=10`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="qr-code-modal"
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200 font-['Vazirmatn',sans-serif]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">بارکد QR منوی دیجیتال</h3>
          <p className="text-xs text-slate-500 mt-1">
            مشتریان کافه می‌توانند با اسکن این بارکد، مشخصات و قیمت‌های به‌روز را در گوشی خود مشاهده کنند.
          </p>
        </div>

        {/* Optional Table Number */}
        <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs">
          <div className="font-bold text-amber-950 mb-1.5">انتخاب میز جهت چاپ استند (اختیاری):</div>
          <div className="flex justify-center items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onSetTableNumber('')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                !tableNumber ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              عمومی
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
              <button
                key={t}
                onClick={() => onSetTableNumber(t.toString())}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  tableNumber === t.toString()
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'
                }`}
              >
                {toPersianDigits(t)}
              </button>
            ))}
          </div>
        </div>

        {/* QR Image Box */}
        <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-100 flex flex-col items-center">
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-48 h-48 rounded-xl shadow-xs border border-amber-200/60"
          />
          <div className="mt-2 font-black text-xs text-amber-900">
            {tableNumber ? `میز شماره ${toPersianDigits(tableNumber)}` : 'منوی دیجیتال کافه بادیگارد'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>کپی لینک منو</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
