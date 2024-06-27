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

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Auth
  const { signUp } = useAuth();

  const messaging = isWindowDefined() && getMessaging(app);

  const handleSignUp = useCallback(
    async (data: TAuthForm) => {
      const {
        isAcceptPrivacyPolicy: _isAcceptPrivacyPolicy,
        confirmPassword: _confirmPassword,
        ...fieldValues
      } = data;

      try {
        const fcmToken =
          (messaging && (await requestForToken(messaging))) || '';

        await signUp({ ...fieldValues, fcmToken });

        router.push(ROUTES.ROOT);
      } catch (error) {
        const { message } = error as Error;

        setErrorMessage(message);
      }
    },
    [messaging, router, signUp],
  );

  const handleClearErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  return (
    <AuthForm
      isRegister={true}
      onSubmit={handleSignUp}
      errorMessage={errorMessage}
      onClearErrorMessage={handleClearErrorMessage}
    />
  );
};

export default SignUp;
