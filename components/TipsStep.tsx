
import React, { useState, useEffect } from 'react';
import { ReceiptItem } from '../types';
import { ArrowLeft, ArrowRight, CircleDollarSign, Percent, Banknote, Landmark } from 'lucide-react';

interface Props {
  items: ReceiptItem[];
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

const TipsStep: React.FC<Props> = ({ items, tipAmount, setTipAmount, onNext, onPrev }) => {
  const [useTips, setUseTips] = useState(tipAmount > 0);
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyPercent = (p: number) => {
    setTipAmount(Number((itemsTotal * (p / 100)).toFixed(2)));
  };

  const applyRounding = () => {
    const nextRound = Math.ceil(itemsTotal / 5) * 5; // Round to nearest 5
    const diff = nextRound - itemsTotal;
    setTipAmount(diff > 0 ? Number(diff.toFixed(2)) : 0);
  };

  const handleCustomTip = (val: string) => {
    const num = parseFloat(val) || 0;
    setTipAmount(num);
  };

  useEffect(() => {
    if (!useTips) setTipAmount(0);
  }, [useTips]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Чайові</h2>
        <p className="text-slate-400 mt-1">Додати подяку за обслуговування?</p>
      </div>

      <div 
        onClick={() => setUseTips(!useTips)}
        className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between cursor-pointer ${useTips ? 'bg-indigo-900/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-slate-900/40 border-slate-700 opacity-60'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${useTips ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <CircleDollarSign size={28} />
          </div>
          <div>
            <div className="font-bold text-lg">Додати чайові</div>
            <div className="text-sm text-slate-500">{useTips ? 'Увімкнено' : 'Вимкнено'}</div>
          </div>
        </div>
        <div className={`w-14 h-8 rounded-full relative transition-colors ${useTips ? 'bg-indigo-600' : 'bg-slate-700'}`}>
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${useTips ? 'left-7' : 'left-1'}`} />
        </div>
      </div>

      {useTips && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-3 gap-3">
            {[3, 5, 10].map(p => (
              <button
                key={p}
                onClick={() => applyPercent(p)}
                className={`py-4 rounded-2xl font-black text-xl border-2 transition-all ${tipAmount === Number((itemsTotal * (p / 100)).toFixed(2)) ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
              >
                {p}%
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={applyRounding}
              className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-900 border-2 border-slate-700 rounded-2xl font-bold text-slate-300 hover:border-indigo-500 transition-all"
            >
              <Landmark size={20} /> Округлити
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-700 rounded-3xl p-5">
            <div className="text-xs font-bold text-slate-500 uppercase mb-2 px-1">Власна сума</div>
            <div className="flex items-center gap-3">
              <Banknote className="text-indigo-500" />
              <input
                type="number"
                value={tipAmount || ''}
                onChange={(e) => handleCustomTip(e.target.value)}
                placeholder="0.00"
                className="bg-transparent border-none text-3xl font-black text-white w-full focus:ring-0 p-0"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-3">
            <div className="flex justify-between text-slate-400">
              <span>Сума за товари:</span>
              <span className="font-bold">{itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-indigo-400">
              <span>Чайові:</span>
              <span className="font-bold">+{tipAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white text-2xl font-black pt-3 border-t border-slate-800">
              <span>РАЗОМ:</span>
              <span>{(itemsTotal + tipAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 safe-bottom flex gap-3">
        <button onClick={onPrev} className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-xl font-bold text-lg">Назад</button>
        <button onClick={onNext} className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl">
          Далі <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TipsStep;
