import React from 'react';
import { ReceiptItem, Person, SplitData } from '../types';
import { ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';

interface Props {
  items: ReceiptItem[];
  people: Person[];
  splits: SplitData;
  setSplits: (s: SplitData) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SplitStep: React.FC<Props> = ({ items, people, splits, setSplits, onNext, onPrev }) => {
  const changeQuantity = (itemId: string, personId: string, delta: number) => {
    const itemSplits = { ...(splits[itemId] || {}) };
    const currentQty = itemSplits[personId] || 0;
    const item = items.find(i => i.id === itemId);
    
    if (!item) return;

    const newQty = Math.max(0, currentQty + delta);
    
    // Fix: Explicitly use reduce<number> to ensure the result is treated as a number by the compiler
    const currentTotalAssigned = Object.values(itemSplits)
      .reduce<number>((sum: number, qty: any) => sum + (Number(qty) || 0), 0) - currentQty;

    if (currentTotalAssigned + newQty > item.quantity) {
      itemSplits[personId] = item.quantity - currentTotalAssigned;
    } else {
      itemSplits[personId] = newQty;
    }

    if (itemSplits[personId] === 0) {
      delete itemSplits[personId];
    }

    setSplits({ ...splits, [itemId]: itemSplits });
  };

  // Fix: Explicitly return number and handle potential unknown values in reduce by using reduce<number>
  const getAssignedTotal = (itemId: string): number => {
    const itemData = splits[itemId];
    if (!itemData) return 0;
    // We use any and Number() to ensure we definitely get a numeric sum regardless of TS inference on Object.values
    return Object.values(itemData).reduce<number>((sum: number, qty: any) => sum + (Number(qty) || 0), 0);
  };

  const isFullySplit = items.every(item => getAssignedTotal(item.id) > 0);

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Розподіліть позиції</h2>
        <p className="text-slate-400 mt-1">Хто і скільки взяв?</p>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => {
          // This line previously threw a 'unknown' is not assignable to 'number' error
          const assigned = getAssignedTotal(item.id);
          const remaining = item.quantity - assigned;

          return (
            <div key={item.id} className={`p-5 bg-slate-900 border transition-all rounded-3xl shadow-lg ${assigned > 0 ? 'border-indigo-900/50' : 'border-slate-700'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-100 text-xl leading-tight">{item.name}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-slate-500 font-medium">Всього: {item.quantity} шт</span>
                    {remaining > 0 && (
                      <span className="text-xs text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Залишилось: {remaining.toFixed(1)}</span>
                    )}
                    {remaining <= 0 && (
                      <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">Розділено</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-400 text-lg">{item.price.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-4">
                {people.map(person => {
                  const qty = splits[item.id]?.[person.id] || 0;
                  const isUserActive = qty > 0;

                  return (
                    <div key={person.id} className={`flex items-center justify-between p-3 rounded-2xl transition-all ${isUserActive ? 'bg-indigo-900/30 border border-indigo-500/20' : 'bg-slate-800/40 border border-transparent'}`}>
                      <span className={`text-lg font-bold ${isUserActive ? 'text-indigo-300' : 'text-slate-400'}`}>{person.name}</span>
                      
                      <div className="flex items-center gap-4">
                        {isUserActive && (
                          <span className="text-sm font-bold text-indigo-500">{(qty * item.price).toFixed(2)}</span>
                        )}
                        <div className="flex items-center bg-slate-800 rounded-xl border border-slate-600 shadow-inner overflow-hidden">
                          <button 
                            onClick={() => changeQuantity(item.id, person.id, -1)}
                            className="w-12 h-12 flex items-center justify-center hover:bg-slate-700 active:bg-slate-600 text-slate-300 transition-colors"
                          >
                            <Minus size={20} />
                          </button>
                          <div className="w-10 text-center text-lg font-black text-white">{qty}</div>
                          <button 
                            onClick={() => changeQuantity(item.id, person.id, 1)}
                            disabled={remaining <= 0}
                            className={`w-12 h-12 flex items-center justify-center hover:bg-slate-700 active:bg-slate-600 text-slate-300 transition-colors disabled:opacity-10`}
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 safe-bottom flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-xl font-bold text-lg"
        >
          Назад
        </button>
        <button
          onClick={onNext}
          disabled={!isFullySplit}
          className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-30 shadow-xl"
        >
          Підсумок <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SplitStep;