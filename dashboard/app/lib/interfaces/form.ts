import { TUserDetail } from './user';

export type TPinCodeForm = {
  pinCode: string;
  userId?: string;
};

export type TAuthForm = Omit<TUserDetail, 'id' | 'createdAt'> & {
  confirmPassword: string;
  isAcceptPrivacyPolicy: boolean;
  isRemember: boolean;
};

export type TAddMoneyForm = {
  userId: string;
  amount: string;
};
