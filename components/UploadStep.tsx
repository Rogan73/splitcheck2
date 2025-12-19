
import React, { useState } from 'react';
import { processReceiptImage } from '../services/geminiService';
import { ReceiptItem } from '../types';
import { Camera, Image as ImageIcon, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

interface Props {
  setItems: (items: ReceiptItem[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const UploadStep: React.FC<Props> = ({ setItems, onNext, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const items = await processReceiptImage(base64);
        setItems(items);
        onNext();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-8 h-full items-center justify-center animate-in zoom-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Завантажте чек</h2>
        <p className="text-slate-400 mt-1">ШІ автоматично розпізнає всі позиції</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="relative">
             <Loader2 className="animate-spin text-indigo-500" size={64} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-indigo-400 font-bold text-xl">Аналізую фото...</p>
            <p className="text-slate-500 text-sm animate-pulse">Магія ШІ в процесі</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 w-full">
          <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-700 bg-slate-900/40 rounded-3xl cursor-pointer hover:bg-slate-900/60 transition-all group border-indigo-900/20">
            <div className="p-6 bg-indigo-600 text-white rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] group-active:scale-95 transition-transform mb-4">
              <Camera size={40} />
            </div>
            <span className="font-bold text-indigo-400 text-lg">Зробити фото</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
          </label>

          <label className="flex items-center justify-center gap-3 p-5 bg-slate-900/60 border border-slate-700 rounded-2xl cursor-pointer hover:border-slate-600 shadow-sm transition-all text-slate-300">
            <ImageIcon className="text-indigo-500" />
            <span className="font-semibold">Вибрати файл</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-950/20 text-red-400 rounded-xl border border-red-900/40 animate-in slide-in-from-top duration-300">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <button
        onClick={onPrev}
        className="text-slate-500 font-medium flex items-center gap-1 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft size={18} /> До списку людей
      </button>
    </div>
  );
};

export default UploadStep;
