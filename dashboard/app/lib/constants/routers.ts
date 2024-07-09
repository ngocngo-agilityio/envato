import { AUTHENTICATION_ROLE } from './authentication';

export const ROUTES = {
  ROOT: '/',
  LOGIN: 'login',
  REGISTER: 'register',
  TRANSACTION: 'transactions',
  MY_WALLET: 'my-wallets',
  USER: 'users',
  CALENDAR: 'calendar',
  HISTORY: 'histories',
  SETTING: 'settings',
  FORGOT_PASSWORD: 'forgot-password',
  SIGN_OUT: 'sign-out',
  NOT_FOUND: '*',
  SUPPORT: 'supports',
  INBOX: 'inbox',
  PRODUCT: 'products',
  RECENT_ACTIVITIES: 'recent-activities',
};

export const COMMON_ROUTES = [
  {
    id: 1,
    path: ROUTES.NOT_FOUND,
  },
];

export const PRIVATE_ROUTES = (role: string) => [
  {
    id: 1,
    path: ROUTES.ROOT,
  },
  {
    id: 2,
    path: ROUTES.TRANSACTION,
  },
  {
    id: 3,
    path: ROUTES.MY_WALLET,
  },
  {
    id: 4,
    path: ROUTES.HISTORY,
  },
  {
    id: 5,
    path: ROUTES.SETTING,
  },
  {
    ...(role === AUTHENTICATION_ROLE.SUPER_ADMIN && {
      id: 6,
      path: ROUTES.USER,
    }),
  },
  {
    id: 7,
    path: ROUTES.PRODUCT,
  },
  {
    id: 8,
    path: ROUTES.RECENT_ACTIVITIES,
  },
  {
    id: 9,
    path: ROUTES.CALENDAR,
  },
  {
    ...(role === AUTHENTICATION_ROLE.SUPER_ADMIN && {
      id: 10,
      path: ROUTES.INBOX,
    }),
  },
  {
    id: 11,
    path: ROUTES.SUPPORT,
  },
];

export const PUBLIC_ROUTES = [
  {
    id: 1,
    path: ROUTES.LOGIN,
  },
  {
    id: 2,
    path: ROUTES.REGISTER,
  },
  {
    id: 3,
    path: ROUTES.FORGOT_PASSWORD,
  },
  {
    id: 4,
    path: ROUTES.SIGN_OUT,
  },
];
