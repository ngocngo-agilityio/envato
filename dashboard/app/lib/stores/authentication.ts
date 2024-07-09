import {
  StateStorage,
  StorageValue,
  createJSONStorage,
  persist,
} from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

// Constants
import { EXPIRED_DAY, STORE_KEY } from '@/lib/constants';

// Types
import { TUserDetail } from '@/lib/interfaces';

// Utils
import {
  convertToString,
  getExpireTime,
  getValueFromLocalStore,
  loginExpired,
} from '@/lib/utils';

export type TUserInfo = Omit<TUserDetail, 'password'> | null;
export type TAuthStoreData = {
  user: Partial<TUserInfo> | null;
  isRemember: boolean;
  date: number;
};
export type TAuthStoreAction = {
  updateStore: (data: Partial<TAuthStoreData>) => void;
  clearStore: () => void;
};

const DEFAULT_VALUE = {
  user: null,
  isRemember: false,
  date: 0,
};

const getItem: StateStorage['getItem'] = (key: string) => {
  const response: string = getValueFromLocalStore(key);
  const defaultValue: string = convertToString(DEFAULT_VALUE);

  if (response) {
    const {
      state: { user, date, isRemember },
    }: StorageValue<TAuthStoreData & TAuthStoreAction> = JSON.parse(response);

    const expiredTime: number = getExpireTime(
      date,
      isRemember ? EXPIRED_DAY.REMEMBER : EXPIRED_DAY.NOT_REMEMBER,
    );

    if (loginExpired(expiredTime) && user) return defaultValue;

    return response;
  }

  return defaultValue;
};

const setItem: StateStorage['setItem'] = (key: string, value: string) => {
  const {
    state: { user },
  }: StorageValue<TAuthStoreData & TAuthStoreAction> = JSON.parse(value);
  const hasUser: boolean = !!user && !!Object.keys(user).length;

  if (hasUser) {
    return localStorage.setItem(key, value);
  }

  return localStorage.removeItem(key);
};

const myStore: () => StateStorage = (): StateStorage => ({
  setItem,
  getItem,
  removeItem: localStorage.removeItem.bind(localStorage),
});

export const authStore = createWithEqualityFn(
  persist<TAuthStoreData & TAuthStoreAction>(
    (set) => ({
      ...DEFAULT_VALUE,
      updateStore: (data: Partial<TAuthStoreData>) => set(data),
      clearStore: () => set(DEFAULT_VALUE),
    }),
    {
      name: STORE_KEY.AUTH,
      storage: createJSONStorage(myStore),
    },
  ),
);
