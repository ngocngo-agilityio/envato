// TODO: Will provide latter
export const BASE_API = '';
export const USERS_API = process.env.NEXT_PUBLIC_API_USER || BASE_API;
export const STATISTICAL_API =
  process.env.NEXT_PUBLIC_STATISTICAL_API || BASE_API;
export const UPLOAD_IMAGE_API = process.env.NEXT_PUBLIC_UPLOAD_URL || BASE_API;

export const END_POINTS = {
  AUTHEN_USERS: '/authenUsers',
  USERS: '/users',
  TRANSACTIONS: '/transactions',
  PRODUCTS: '/products',
  RECENT_ACTIVITIES: '/activities',
  STATISTICS: '/statistics',
  REVENUE: '/revenue',
  EFFICIENCY: '/efficiency',
  NOTIFICATION: '/notifications',
  EMPLOYEES: '/employees',
  OVERALL_BALANCE: '/overall-balance',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DELETE_TRANSACTION: '/delete-transactions',
  EDIT_TRANSACTION: '/edit-transactions',
  CREATE_PIN: '/create-pin-code',
  CONFIRM_PIN: '/pin-code',
  UPDATE_PASSWORD: '/update-password',
  MY_WALLET: '/wallets',
  ADD_MONEY: '/add-money',
  SEND_MONEY: '/send-money',
  SUPPORT: '/supports',
  LOCK: '/lock',
  UNLOCK: '/unlock',
  ADMIN: '/admin',
  SETTINGS: '/settings',
  LOGIN: '/login',
  WALLET: '/my-wallets',
  EVENT: '/events',
};

export const SEARCH_PARAM = {
  EMAIL: 'email',
  PASSWORD: 'password',
  TRANSACTION_NAME: 'transactionName',
  UPLOAD_IMAGE: process.env.NEXT_PUBLIC_UPLOAD_KEY,
};
