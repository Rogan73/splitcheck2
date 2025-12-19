
import React from 'react';
import { ReceiptItem, Person, SplitData } from '../types';
import { RefreshCcw, Share2, Wallet } from 'lucide-react';

interface Props {
  items: ReceiptItem[];
  people: Person[];
  splits: SplitData;
  tipAmount: number;
  onReset: () => void;
}

const SummaryStep: React.FC<Props> = ({ items, people, splits, tipAmount, onReset }) => {
  const itemsTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalWithTips = itemsTotal + tipAmount;
  
  // Tip multiplier for each person's subtotal
  const tipFactor = itemsTotal > 0 ? (totalWithTips / itemsTotal) : 1;

  const getPersonSubtotal = (personId: string) => {
    let subtotal = 0;
    items.forEach(item => {
      const assignedQty = splits[item.id]?.[personId] || 0;
      subtotal += assignedQty * item.price;
    });
    return subtotal;
  };

  const getPersonTotalWithTips = (personId: string) => {
    return getPersonSubtotal(personId) * tipFactor;
  };

  const getPersonItems = (personId: string) => {
    return items
      .filter(item => (splits[item.id]?.[personId] || 0) > 0)
      .map(item => ({
        ...item,
        personalQty: splits[item.id][personId]
      }));
  };

  const shareResults = () => {
    const text = "🧾 Підсумок рахунку (з чайовими):\n" + people
      .map(p => {
        const total = getPersonTotalWithTips(p.id);
        return total > 0 ? `${p.name}: ${total.toFixed(2)}` : null;
      })
      .filter(Boolean)
      .join('\n');
      
    if (navigator.share) {
      navigator.share({ title: 'SplitCheck - Підсумок', text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Результати скопійовано!");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom duration-500 pb-10">
      <div className="text-center">
        <div className="inline-flex p-5 bg-indigo-500/10 text-indigo-400 rounded-full mb-3 shadow-[0_0_30px_rgba(99,102,241,0.1)] border border-indigo-500/20">
           <Wallet size={36} />
        </div>
        <h2 className="text-2xl font-bold text-white">Хто скільки винен</h2>
        <p className="text-slate-400 mt-1">Чайові враховано пропорційно</p>
      </div>

      <div className="flex flex-col gap-4">
        {people.map((person) => {
          const total = getPersonTotalWithTips(person.id);
          const subtotal = getPersonSubtotal(person.id);
          const pItems = getPersonItems(person.id);
          if (total === 0) return null;

          return (
            <div key={person.id} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-lg overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-slate-100">{person.name}</span>
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-400">{total.toFixed(2)}</div>
                  {tipAmount > 0 && <div className="text-xs text-slate-500">з чайовими (було {subtotal.toFixed(2)})</div>}
                </div>
              </div>
              <div className="space-y-3 border-t border-slate-800 pt-5">
                {pItems.map(item => (
                  <div key={item.id} className="flex justify-between text-base text-slate-400">
                    <span className="flex-1 pr-4">{item.name} × {item.personalQty}</span>
                    <span className="font-medium text-slate-300">{(item.personalQty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-indigo-900/30 text-white rounded-3xl p-6 shadow-inner space-y-2">
        <div className="flex justify-between text-slate-500 text-sm font-bold uppercase tracking-wider">
          <span>Товари</span>
          <span>{itemsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-indigo-400/80 text-sm font-bold uppercase tracking-wider">
          <span>Чайові</span>
          <span>+{tipAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
           <span className="font-bold text-indigo-400 uppercase tracking-widest text-sm">Всього до оплати</span>
           <span className="text-3xl font-black">{totalWithTips.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={shareResults}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          <Share2 size={24} /> Надіслати
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-slate-700 text-slate-200 py-5 rounded-2xl font-bold hover:bg-slate-600 active:scale-[0.98] transition-all"
        >
          <RefreshCcw size={24} /> Заново
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;
