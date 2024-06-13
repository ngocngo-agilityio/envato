'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Button, HStack, Text, VStack, Box, useToast } from '@chakra-ui/react';
import { Controller, SubmitHandler } from 'react-hook-form';

// Hooks
import { useForm } from '@/lib/hooks';

// Constants
import {
  ROUTES,
  AUTH_SCHEMA,
  SUCCESS_MESSAGES,
  STATUS,
  ERROR_MESSAGES,
} from '@/lib/constants';

// Components
import { InputField } from '@/ui/components';

// Firebase

import { sendPasswordResetEmail } from 'firebase/auth';

// Utils
import { auth, customToast } from '@/lib/utils';

type TForgotPasswordForm = {
  email: string;
};

const ForgotPassword = (): JSX.Element => {
  // Control form
  const {
    control,
    formState: {
      errors: { root },
      isValid,
      isSubmitting,
    },
    reset,
    handleSubmit,
  } = useForm<TForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const toast = useToast();
  // TODO: Update later
  const handleSubmitForm: SubmitHandler<TForgotPasswordForm> = useCallback(
    async (data) => {
      try {
        await sendPasswordResetEmail(auth, data.email);
        toast(
          customToast(
            SUCCESS_MESSAGES.FORGOT_PASSWORD.title,
            SUCCESS_MESSAGES.FORGOT_PASSWORD.description,
            STATUS.SUCCESS,
          ),
        );
      } catch {
        toast(
          customToast(
            ERROR_MESSAGES.FORGOT_PASSWORD.title,
            ERROR_MESSAGES.FORGOT_PASSWORD.description,
            STATUS.ERROR,
          ),
        );
      } finally {
        reset();
      }
    },
    [reset, toast],
  );

  return (
    <VStack
      id="forgot-password-form"
      as="form"
      gap={6}
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <Controller
        rules={AUTH_SCHEMA.EMAIL}
        control={control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <InputField
            variant="authentication"
            placeholder="Enter your email"
            isError={!!error?.message}
            errorMessages={error?.message}
            isDisabled={isSubmitting}
            {...field}
          />
        )}
      />

      {/* Helpers */}
      <HStack justifyContent="end" w="100%">
        <Text
          as={Link}
          href={`/${ROUTES.LOGIN}`}
          aria-label="forgot password"
          color="text.currencyColor"
          fontWeight="semibold"
          textTransform="capitalize"
          textDecoration="underline"
        >
          back to sign in
        </Text>
      </HStack>

      {/* Show API error */}
      <Box w="full">
        <Text color="red" textAlign="center" py={2} h={10}>
          {root?.message}
        </Text>
        <Button
          aria-label="Recover Password"
          textTransform="capitalize"
          isDisabled={!isValid || isSubmitting}
          form="forgot-password-form"
          type="submit"
        >
          Recover Password
        </Button>
      </Box>
    </VStack>
  );
};

export default ForgotPassword;
