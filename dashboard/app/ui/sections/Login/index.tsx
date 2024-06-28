'use client';

// Libs
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

// Constants
import { ROUTES } from '@/lib/constants';

// Hooks
import { useAuth } from '@/lib/hooks';

// Types
import { TAuthForm } from '@/lib/interfaces';

// Utils
import { isWindowDefined, requestForToken, app } from '@/lib/utils';

// Fire base
import { getMessaging } from 'firebase/messaging';

// Components
import { AuthForm } from '@/ui/components';

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

  const handleResetError = useCallback(() => {
    setErrorMessage('');
  }, []);

  return (
    <AuthForm
      onSubmit={handleLogin}
      errorMessage={errorMessage}
      onResetError={handleResetError}
    />
  );
};

export default Login;
