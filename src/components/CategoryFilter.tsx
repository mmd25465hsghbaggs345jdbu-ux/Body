import React from 'react';
import {
  Sparkles,
  IceCream2,
  Box,
  Citrus,
  Zap,
  CupSoda,
  Flame,
  Coffee
} from 'lucide-react';
import { CATEGORIES } from '../data/mockProducts';
import { CategoryId } from '../types';
import { toPersianDigits } from '../utils/format';

interface CategoryFilterProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'IceCream2':
        return <IceCream2 className="w-4 h-4" />;
      case 'Box':
        return <Box className="w-4 h-4" />;
      case 'Citrus':
        return <Citrus className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'CupSoda':
        return <CupSoda className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div id="category-filter-bar" className="mb-8 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border whitespace-nowrap shadow-2xs ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20 scale-[1.02]'
                  : 'bg-white hover:bg-amber-50/70 text-slate-700 hover:text-amber-900 border-slate-200/80 hover:border-amber-200'
              }`}
            >
              <span className={isSelected ? 'text-amber-200' : 'text-amber-600'}>
                {getIcon(cat.iconName)}
              </span>
              <span>{cat.title}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected
                    ? 'bg-amber-700/80 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {toPersianDigits(count)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
