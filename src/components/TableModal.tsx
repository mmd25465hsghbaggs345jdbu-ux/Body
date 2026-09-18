import React from 'react';
import { X, Utensils, Check } from 'lucide-react';
import { toPersianDigits } from '../utils/format';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  onSelectTable: (tbl: string) => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
  onSelectTable,
}) => {
  if (!isOpen) return null;

  const tables = Array.from({ length: 24 }, (_, i) => (i + 1).toString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="table-selection-modal"
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">انتخاب شماره میز در سالن</h3>
            <p className="text-xs text-slate-500">
              شماره میز روی پلاک میز شما در کافه بادیگارد درج شده است
            </p>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 py-2 max-h-60 overflow-y-auto">
          {tables.map((tbl) => {
            const isSelected = tableNumber === tbl;
            return (
              <button
                key={tbl}
                onClick={() => {
                  onSelectTable(tbl);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition font-bold text-sm ${
                  isSelected
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <span>{toPersianDigits(tbl)}</span>
                <span className="text-[10px] font-normal opacity-80">میز</span>
              </button>
            );
          })}
        </div>

        {/* Clear selection option */}
        {tableNumber && (
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">
              میز فعلی: <span className="font-bold text-slate-800">شماره {toPersianDigits(tableNumber)}</span>
            </span>
            <button
              onClick={() => {
                onSelectTable('');
                onClose();
              }}
              className="text-rose-600 hover:underline font-medium"
            >
              حذف انتخاب میز
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
