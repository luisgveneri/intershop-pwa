export interface Price {
  type: 'Money';
  value: number;
  currency: string;
  minQuantity?: number;
}

export * from './price.helper';
