
import React from 'react';
import { ReceiptItem } from '../types';
import { Trash2, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  items: ReceiptItem[];
  setItems: (i: ReceiptItem[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ItemsStep: React.FC<Props> = ({ items, setItems, onNext, onPrev }) => {
  const updateItem = (id: string, field: keyof ReceiptItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: 'Нова позиція', quantity: 1, price: 0 }]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Перевірка товарів</h2>
        <p className="text-slate-400 mt-1">Виправте назви або ціни, якщо потрібно</p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="p-5 bg-slate-900 border border-slate-700 rounded-2xl shadow-sm flex flex-col gap-4">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
              className="bg-transparent font-bold text-slate-100 w-full border-none focus:ring-0 p-0 text-xl"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase font-bold px-1">К-ть</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-slate-800 border-none text-center font-bold text-indigo-400 rounded-xl py-3 px-2 focus:ring-2 focus:ring-indigo-500 text-lg"
                  />
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-xs text-slate-500 uppercase font-bold px-1">Ціна</span>
                   <div className="flex items-center bg-slate-800 rounded-xl py-3 px-3 focus-within:ring-2 focus-within:ring-indigo-500">
                     <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-24 bg-transparent border-none text-center font-bold text-indigo-400 p-0 text-lg"
                    />
                   </div>
                </div>
              </div>
              <div className="flex items-end flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold mb-1">Сума</span>
                <span className="font-black text-white text-xl">{(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => deleteItem(item.id)} className="text-slate-600 hover:text-red-400 transition-colors mt-3 p-1">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="flex items-center justify-center gap-2 p-5 border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-400 hover:border-indigo-800 transition-all bg-slate-900/30 font-bold"
        >
          <Plus size={24} /> Додати позицію
        </button>
      </div>

      <div className="mt-4 p-6 bg-indigo-900/20 border border-indigo-800/30 rounded-2xl flex justify-between items-center shadow-lg">
        <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Разом</span>
        <span className="text-3xl font-black text-white">{total.toFixed(2)}</span>
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
          className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
        >
          Далі <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ItemsStep;
