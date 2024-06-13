import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { shallow } from 'zustand/shallow';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Constants
import {
  END_POINTS,
  ERROR_MESSAGES,
  IMAGES,
  LOGOUT_TIME,
  ROUTES,
} from '@/lib/constants';

// Services
import { mainHttpService, recentActivitiesHttpService } from '@/lib/services';

// Stores
import { authStore } from '@/lib/stores';

// Utils
import {
  formatUppercaseFirstLetter,
  getCurrentTimeSeconds,
  logActivity,
} from '@/lib/utils';

// Types
import { TUserDetail, EActivity, TActivitiesRequest } from '@/lib/interfaces';

type TSignUpErrorField = Partial<
  Record<keyof Omit<TUserDetail, 'id' | 'createdAt'>, string>
>;

export type TUserInfo = Omit<TUserDetail, 'password'> | null;

export type TUserAxiosResponse = Omit<
  TUserDetail & { _id: string },
  'id'
> | null;

export type TUseAuth = {
  user: TUserInfo;
  isRemember: boolean;
  date: number;
  setUser: (user: TUserDetail) => void;
  signIn: (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    isRemember?: boolean,
  ) => Promise<void>;
  signUp: (userInfo: Omit<TUserDetail, 'id' | 'createdAt'>) => Promise<{
    errors?: TSignUpErrorField;
  }>;
  signOut: () => void;
};

export const useAuth = () => {
  const { user } = authStore();
  const [isLogout, setIsLogout] = useState(false);
  const router = useRouter();
  const { updateStore, clearStore } = authStore(
    (state) => ({
      updateStore: state.updateStore,
      clearStore: state.clearStore,
    }),
    shallow,
  );
  const handleSignInWithFirebase = useCallback(
    async (email: string, password: string) => {
      const auth = getAuth();
      return await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const { uid, email } = userCredential.user;

          return {
            uid,
            email,
          };
        },
      );
    },
    [],
  );

  const handleSignIn = useCallback(
    async (
      {
        email,
        password,
        fcmToken = '',
      }: {
        email: string;
        password: string;
        fcmToken?: string;
      },
      isRemember?: boolean,
    ): Promise<void> => {
      try {
        const { uid } = await handleSignInWithFirebase(email, password);

        const { data }: AxiosResponse<TUserAxiosResponse | undefined> =
          await mainHttpService.post<TUserAxiosResponse | undefined>({
            path: END_POINTS.SIGN_IN,
            data: {
              email,
              password,
              fcmToken,
              uid,
            },
            actionName: EActivity.SIGN_IN,
            onActivity: logActivity,
          });

        let localData: TUserInfo | undefined;
        if (data) {
          const { _id, ...rest } = data;
          localData = { ...rest, id: _id };

          document.cookie = `userId=${_id}`;
        }

        return updateStore({
          user: localData,
          isRemember,
          date: getCurrentTimeSeconds(),
        });
      } catch (error) {
        const { response } = error as AxiosError<string>;

        if (!response) {
          throw new Error(
            formatUppercaseFirstLetter(ERROR_MESSAGES.AUTH_INCORRECT),
          );
        }

        throw new Error(formatUppercaseFirstLetter(response?.data));
      }
    },
    [handleSignInWithFirebase, updateStore],
  );

  const handleSignUp = useCallback(
    async (
      userInfo: Omit<TUserDetail, 'id' | 'createdAt'> & { fcmToken: string },
    ): Promise<void> => {
      const { email, password, firstName, lastName, fcmToken } = userInfo;
      try {
        const { data }: AxiosResponse<TUserAxiosResponse | undefined> =
          await mainHttpService.post<TUserAxiosResponse | undefined>({
            path: END_POINTS.SIGN_UP,
            data: {
              ...userInfo,
              avatarURL: IMAGES.AVATAR_SIGN_UP.url,
              createdAt: Date.now(),
              email,
              password,
              firstName,
              lastName,
              fcmToken,
            },
            actionName: EActivity.SIGN_UP,
            onActivity: logActivity,
          });

        let localData: TUserInfo | undefined;
        if (data) {
          const { _id, ...rest } = data;
          localData = { ...rest, id: _id };
        }

        return updateStore({ user: localData, date: getCurrentTimeSeconds() });
      } catch (error) {
        const { response } = error as AxiosError<string>;

        throw new Error(formatUppercaseFirstLetter(response?.data));
      }
    },
    [updateStore],
  );

  const handleLogout = useCallback(
    async (
      redirectPath?: string,
      option?: keyof Pick<typeof router, 'push' | 'replace'>,
    ) => {
      setIsLogout(true);

      await recentActivitiesHttpService.post<TActivitiesRequest>(
        END_POINTS.RECENT_ACTIVITIES,
        {
          userId: user?.id,
          actionName: EActivity.SIGN_OUT,
        },
      );

      setTimeout(() => {
        clearStore();
        setIsLogout(false);
        router[option ?? 'replace'](redirectPath ?? ROUTES.LOGIN);
      }, LOGOUT_TIME);
    },
    [clearStore, router, user?.id],
  );

  return {
    isLogoutHandling: isLogout,
    setUser: updateStore,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleLogout,
    handleSignInWithFirebase,
  };
};
