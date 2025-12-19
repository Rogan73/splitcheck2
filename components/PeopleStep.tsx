
import React, { useState } from 'react';
import { Person } from '../types';
import { UserPlus, Trash2, ArrowRight } from 'lucide-react';

interface Props {
  people: Person[];
  setPeople: (p: Person[]) => void;
  onNext: () => void;
}

const PeopleStep: React.FC<Props> = ({ people, setPeople, onNext }) => {
  const [name, setName] = useState('');

  const addPerson = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    setPeople([...people, { id: Math.random().toString(36).substr(2, 9), name: name.trim() }]);
    setName('');
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Хто в справі?</h2>
        <p className="text-slate-400 mt-1">Додайте друзів, з якими ділите рахунок</p>
      </div>

      <form onSubmit={addPerson} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ім'я друга..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg text-white placeholder:text-slate-600"
          autoFocus
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
        >
          <UserPlus size={24} />
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {people.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700 text-slate-500">
            Список порожній
          </div>
        ) : (
          people.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-700 rounded-xl shadow-sm hover:border-slate-600 transition-all">
              <span className="font-medium text-lg text-slate-200">{p.name}</span>
              <button
                onClick={() => removePerson(p.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 safe-bottom">
        <button
          disabled={people.length === 0}
          onClick={onNext}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl active:scale-[0.98] transition-all"
        >
          Далі <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PeopleStep;
