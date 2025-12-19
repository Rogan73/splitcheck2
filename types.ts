
export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Person {
  id: string;
  name: string;
}

export interface SplitData {
  [itemId: string]: {
    [personId: string]: number; // personId to quantity assigned
  };
}

export enum AppStep {
  PEOPLE = 'PEOPLE',
  UPLOAD = 'UPLOAD',
  ITEMS = 'ITEMS',
  TIPS = 'TIPS',
  SPLIT = 'SPLIT',
  SUMMARY = 'SUMMARY'
}
