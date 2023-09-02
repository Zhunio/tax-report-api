export type ExcelPayment = ExcelPaymentRow | ExcelPaymentEmptyRow;

export interface ExcelPaymentRow {
  Type: string;
  Date: Date;
  Num: string;
  Name: string;
  'Pay Meth': string;
  Amount: number;
}

export interface ExcelPaymentEmptyRow {
  __EMPTY: string;
}
