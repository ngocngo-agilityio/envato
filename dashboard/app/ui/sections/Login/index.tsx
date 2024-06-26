'use client';

// Components
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/lib/hooks';
import { TUserDetail } from '@/lib/interfaces';
import { isWindowDefined, requestForToken, app } from '@/lib/utils';
import { AuthForm } from '@/ui/components';
import { getMessaging } from 'firebase/messaging';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type TAuthForm = Omit<TUserDetail, 'id' | 'createdAt'> & {
  confirmPassword: string;
  isAcceptPrivacyPolicy: boolean;
  isRemember: false;
};

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Auth
  const { signIn } = useAuth();

  const messaging = isWindowDefined() && getMessaging(app);

  const handleLogin = useCallback(
    async (data: TAuthForm) => {
      try {
        const { email, password, isRemember } = data;
        const fcmToken =
          (messaging && (await requestForToken(messaging))) || '';

        await signIn({ email, password, fcmToken }, isRemember);

        router.push(ROUTES.ROOT);
      } catch (error) {
        const { message } = error as Error;

        setErrorMessage(message);
      }
    },
    [messaging, router, signIn],
  );

  const handleClearErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  return (
    <AuthForm
      onSubmit={handleLogin}
      errorMessage={errorMessage}
      onClearErrorMessage={handleClearErrorMessage}
    />
  );
};

export default Login;
