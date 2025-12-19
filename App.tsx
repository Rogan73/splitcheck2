
import React, { useState } from 'react';
import { AppStep, Person, ReceiptItem, SplitData } from './types';
import PeopleStep from './components/PeopleStep';
import UploadStep from './components/UploadStep';
import ItemsStep from './components/ItemsStep';
import TipsStep from './components/TipsStep';
import SplitStep from './components/SplitStep';
import SummaryStep from './components/SummaryStep';
import { Users, Receipt, List, LayoutPanelLeft, CheckCircle, CircleDollarSign } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.PEOPLE);
  const [people, setPeople] = useState<Person[]>([]);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [splits, setSplits] = useState<SplitData>({});
  const [tipAmount, setTipAmount] = useState<number>(0);

  const nextStep = () => {
    if (step === AppStep.PEOPLE) setStep(AppStep.UPLOAD);
    else if (step === AppStep.UPLOAD) setStep(AppStep.ITEMS);
    else if (step === AppStep.ITEMS) setStep(AppStep.TIPS);
    else if (step === AppStep.TIPS) setStep(AppStep.SPLIT);
    else if (step === AppStep.SPLIT) setStep(AppStep.SUMMARY);
  };

  const prevStep = () => {
    if (step === AppStep.UPLOAD) setStep(AppStep.PEOPLE);
    else if (step === AppStep.ITEMS) setStep(AppStep.UPLOAD);
    else if (step === AppStep.TIPS) setStep(AppStep.ITEMS);
    else if (step === AppStep.SPLIT) setStep(AppStep.TIPS);
    else if (step === AppStep.SUMMARY) setStep(AppStep.SPLIT);
  };

  const reset = () => {
    setStep(AppStep.PEOPLE);
    setPeople([]);
    setItems([]);
    setSplits({});
    setTipAmount(0);
  };

  const renderStep = () => {
    switch (step) {
      case AppStep.PEOPLE:
        return <PeopleStep people={people} setPeople={setPeople} onNext={nextStep} />;
      case AppStep.UPLOAD:
        return <UploadStep setItems={setItems} onNext={nextStep} onPrev={prevStep} />;
      case AppStep.ITEMS:
        return <ItemsStep items={items} setItems={setItems} onNext={nextStep} onPrev={prevStep} />;
      case AppStep.TIPS:
        return <TipsStep items={items} tipAmount={tipAmount} setTipAmount={setTipAmount} onNext={nextStep} onPrev={prevStep} />;
      case AppStep.SPLIT:
        return <SplitStep items={items} people={people} splits={splits} setSplits={setSplits} onNext={nextStep} onPrev={prevStep} />;
      case AppStep.SUMMARY:
        return <SummaryStep items={items} people={people} splits={splits} tipAmount={tipAmount} onReset={reset} />;
      default:
        return null;
    }
  };

  const stepsIcons = [
    { s: AppStep.PEOPLE, i: <Users size={18} /> },
    { s: AppStep.UPLOAD, i: <Receipt size={18} /> },
    { s: AppStep.ITEMS, i: <List size={18} /> },
    { s: AppStep.TIPS, i: <CircleDollarSign size={18} /> },
    { s: AppStep.SPLIT, i: <LayoutPanelLeft size={18} /> },
    { s: AppStep.SUMMARY, i: <CheckCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-800 text-slate-100 shadow-2xl overflow-hidden border-x border-slate-700">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-md p-4 text-white shrink-0 sticky top-0 z-50 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
          <Receipt /> SplitCheck
        </h1>
        {/* Progress Bar */}
        <div className="flex justify-between mt-4 px-2">
          {stepsIcons.map(({ s, i }, idx) => {
            const isActive = step === s;
            const isPast = stepsIcons.findIndex(x => x.s === step) > idx;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : isPast ? 'bg-slate-600 text-slate-400' : 'bg-slate-700 text-slate-500'
                }`}>
                  {i}
                </div>
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto pb-32">
        {renderStep()}
      </main>
    </div>
  );
};

export default App;
