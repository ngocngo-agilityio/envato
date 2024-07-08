// Libs
import { Control, UseFormHandleSubmit } from 'react-hook-form';

// Types
import { TUserDetail } from './user';
import { TAddMoneyForm } from './form';

export type TMoney = {
  amount: number;
};

export type TAddMoney = TMoney & {
  userId: string;
};

export type TSendMoney = TAddMoney & {
  memberId: string;
};

export type TMoneyResponse = {
  message: string;
};

export type TTransfer = {
  amount: string;
  memberId: string;
  userId: string;
};

export type TTransferDirtyFields = {
  [K in keyof TTransfer]?: Readonly<boolean>;
};

export type TWithSendMoney = {
  control: Control<TTransfer>;
  dirtyFields: TTransferDirtyFields;
  userList: Array<
    Omit<TUserDetail, 'id'> & {
      _id: string;
    }
  >;
  isSendMoneySubmitting: boolean;
  onSubmitSendMoneyHandler: UseFormHandleSubmit<TTransfer>;
  onConfirmPinCodeSuccess: () => void;
};

export type TWithSendMoneyForCalendar = TWithSendMoney & {
  balance: number;
};

export type TWithAddMoney = {
  control: Control<TAddMoneyForm>;
  isDirty: boolean;
  isSubmitting: boolean;
  onSubmitHandler: UseFormHandleSubmit<TAddMoneyForm>;
  onConfirmPinCodeSuccess: () => void;
};

export type TWithBalance = {
  balance: number;
  isShowBalance: boolean;
  onConfirmPinCodeSuccess: () => void;
  onToggleShowBalance: () => void;
};
