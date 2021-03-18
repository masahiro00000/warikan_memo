export interface IPayment {
  id: number;
  amount: number;
  payer: string;
  debtors: string[];
  memo: string;
  deleteFlag: boolean;
}

export interface IRecode {
  key: string;
  groupName: string;
  members: string[];
  payments: IPayment[];
  creationDatetime: string;
  updateDatetime: string;
  deleteFlag: boolean;
  version: number;
}

export interface IUpdateDAO {
  key: string;
  groupName: string;
  members: string[];
  payments: IPayment[];
  deleteFlag: boolean;
  version: number;
}

export interface IRemovemMmberDialogData {
  isRemovable: boolean;
  member: string;
}
