export type TRecentActivities = {
  _id: string;
  actionName: string;
  email: string;
  createdAt: string;
};

export interface TActivitiesRequest {
  _id: string;
  actionName: string;
  email: string;
  createdAt?: string;
  currentPage?: number;
  limit?: number;
}

export enum EActivity {
  SIGN_IN = 'Sign in',
  SIGN_OUT = 'Sign out',
  SIGN_UP = 'Sign up',
  FORGOT_PASSWORD = 'Forgot password',
  ADD_MONEY = 'Add money',
  SEND_MONEY = 'Send money',
  UPDATE_TRANSACTION = 'Update transaction',
  DELETE_TRANSACTION = 'Delete transaction',
  CREATE_PRODUCT = 'Create product',
  UPDATE_PRODUCT = 'Update product',
  DELETE_PRODUCT = 'Delete product',
  CREATE_ISSUES = 'Create issues',
  SAVE_PROFILE = 'Save profile',
  SAVE_PASSWORD = 'Save change password',
  CREATE_PIN_CODE = 'Create pin code',
  ACTIVE_PIN_CODE = 'Active pin code',
  ADD_EVENT = 'Add event',
  UPDATE_EVENT = 'Update event',
  DELETE_EVENT = 'Delete event',
}
