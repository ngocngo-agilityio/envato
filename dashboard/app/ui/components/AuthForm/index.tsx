'use client';

import { ChangeEvent, memo, useCallback, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler } from 'react-hook-form';
import {
  Button,
  HStack,
  Text,
  VStack,
  Checkbox,
  useDisclosure,
  Box,
  Link as ChakraLink,
  Flex,
} from '@chakra-ui/react';

// Components
import { InputField, PasswordSwitcher } from '@/ui/components';

// Constants
import { ROUTES, AUTH_SCHEMA } from '@/lib/constants';

// Hooks
import { useForm, useAuth } from '@/lib/hooks';

// Utils
import {
  isWindowDefined,
  validatePassword,
  app,
  requestForToken,
} from '@/lib/utils';

// Types
import { TUserDetail } from '@/lib/interfaces';

// Layouts
import { AuthFooter } from '@/ui/layouts';

// firebase
import { getMessaging } from 'firebase/messaging';

type TAuthForm = Omit<TUserDetail, 'id' | 'createdAt'> & {
  confirmPassword: string;
  isAcceptPrivacyPolicy: boolean;
  isRemember: false;
};

interface AuthFormProps {
  isRegister?: boolean;
}

const AuthForm = ({ isRegister = false }: AuthFormProps): JSX.Element => {
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  // Control form
  const {
    control,
    formState: {
      errors: { root },
      dirtyFields,
      defaultValues,
      isSubmitting,
    },
    handleSubmit,
    setError,
    clearErrors,
  } = useForm<TAuthForm>({
    defaultValues: {
      email: '',
      password: '',

      ...(!isRegister && {
        isRemember: false,
      }),
      ...(isRegister && {
        firstName: '',
        lastName: '',
        confirmPassword: '',
        isAcceptPrivacyPolicy: false,
      }),
    },
  });

  // Control show/hide password
  const { isOpen: isShowPassword, onToggle: onShowPassword } = useDisclosure();
  const { isOpen: isShowConfirmPassword, onToggle: onShowConfirmPassword } =
    useDisclosure();

  const messaging = isWindowDefined() ? getMessaging(app) : null;

  const isDisabledSubmitBtn: boolean = (() => {
    const getLength = (object: object): number => Object.keys(object).length;

    const isFillAllFields: boolean = isRegister
      ? getLength(dirtyFields) === getLength(defaultValues ?? {})
      : !!(dirtyFields.email && dirtyFields.password);

    return isSubmitting || !isFillAllFields;
  })();

  const handleLogin: SubmitHandler<TAuthForm> = useCallback(
    async (data) => {
      try {
        const { email, password, isRemember } = data;
        const fcmToken =
          (messaging && (await requestForToken(messaging))) || '';

        await signIn({ email, password, fcmToken }, isRemember);

        router.push(ROUTES.ROOT);
      } catch (error) {
        const { message } = error as Error;

        setError('root', { type: 'custom', message });
      }
    },
    [messaging, router, setError, signIn],
  );

  const handleRegister: SubmitHandler<TAuthForm> = useCallback(
    async (data) => {
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

        setError('root', { type: 'custom', message });
      }
    },
    [messaging, router, setError, signUp],
  );

  const handleClearErrorMessage = useCallback(
    (
      field: keyof TAuthForm,
      isError: boolean,
      onChange: (value: string) => void,
    ) =>
      (data: string) => {
        isError && clearErrors(field);

        onChange(data);
      },
    [clearErrors],
  );

  const handleClearRootError = useCallback(
    () => clearErrors('root'),
    [clearErrors],
  );

  const handleClickForgotPassword = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      isSubmitting && e.preventDefault();
    },
    [isSubmitting],
  );

  const handleClickSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      isSubmitting && e.preventDefault();
    },
    [isSubmitting],
  );

  return (
    <Box
      id={!isRegister ? 'login-form' : 'register-form'}
      as="form"
      onSubmit={handleSubmit(!isRegister ? handleLogin : handleRegister)}
      w={{
        base: '100%',
        sm: 425,
        md: 460,
      }}
      margin="auto"
      pb={16}
      sx={{
        boxSizing: {
          base: 'border-box',
          md: 'unset',
        },
      }}
    >
      <VStack gap={6}>
        {isRegister && (
          <HStack
            gap={{
              base: 6,
              md: 10,
            }}
            w="100%"
            flexDirection={{
              base: 'column',
              md: 'row',
            }}
          >
            <Controller
              control={control}
              rules={AUTH_SCHEMA.FIRST_NAME}
              name="firstName"
              render={({ field, fieldState: { error } }) => (
                <InputField
                  variant="authentication"
                  placeholder="First name"
                  {...field}
                  isError={!!error}
                  errorMessages={error?.message}
                  isDisabled={isSubmitting}
                  onChange={handleClearErrorMessage(
                    'firstName',
                    !!error,
                    field.onChange,
                  )}
                  aria-label="first-name"
                />
              )}
            />
            <Controller
              control={control}
              rules={AUTH_SCHEMA.LAST_NAME}
              name="lastName"
              render={({ field, fieldState: { error } }) => (
                <InputField
                  variant="authentication"
                  placeholder="Last name"
                  {...field}
                  isError={!!error}
                  errorMessages={error?.message}
                  isDisabled={isSubmitting}
                  onChange={handleClearErrorMessage(
                    'lastName',
                    !!error,
                    field.onChange,
                  )}
                  aria-label="last-name"
                />
              )}
            />
          </HStack>
        )}
        <Controller
          rules={AUTH_SCHEMA.EMAIL}
          control={control}
          name="email"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            const handleChange = (valueInput: string) => {
              const sanitizedValue = valueInput.trim();

              onChange(sanitizedValue);
            };

            return (
              <InputField
                variant="authentication"
                placeholder="Email"
                isError={!!error?.message}
                errorMessages={error?.message}
                isDisabled={isSubmitting}
                value={value}
                onChange={handleChange}
                onBlur={handleClearRootError}
              />
            );
          }}
        />

        <Controller
          rules={{ validate: validatePassword }}
          control={control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <InputField
              type={isShowPassword ? 'text' : 'password'}
              variant="authentication"
              placeholder="Password"
              rightIcon={
                <PasswordSwitcher
                  isShow={isShowPassword}
                  onClick={onShowPassword}
                />
              }
              isError={!!error?.message}
              errorMessages={error?.message}
              isDisabled={isSubmitting}
              {...field}
              onBlur={handleClearRootError}
            />
          )}
        />

        {/* Helpers */}
        {!isRegister && (
          <HStack justifyContent="space-between" w="100%" mt={6}>
            <Controller
              control={control}
              name="isRemember"
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  aria-label="remember"
                  variant="round"
                  isChecked={value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange(e.target.checked)
                  }
                  isDisabled={isSubmitting}
                  position="relative"
                >
                  <Text fontWeight="semibold">Remember me</Text>
                </Checkbox>
              )}
            />
            <Button
              as={Link}
              isDisabled={isSubmitting}
              href={`/${ROUTES.FORGOT_PASSWORD}`}
              _hover={{
                bg: 'transparent',
              }}
              bg="transparent"
              w="fit-content"
              aria-label="forgot password"
              color="text.currencyColor"
              fontWeight="semibold"
              textTransform="capitalize"
              textDecoration="underline"
              onClick={handleClickForgotPassword}
            >
              forgot password?
            </Button>
          </HStack>
        )}

        {isRegister && (
          <>
            <Controller
              control={control}
              rules={AUTH_SCHEMA.CONFIRM_PASSWORD}
              name="confirmPassword"
              render={({ field, fieldState: { error } }) => (
                <InputField
                  type={isShowConfirmPassword ? 'text' : 'password'}
                  variant="authentication"
                  placeholder="Confirm password"
                  rightIcon={
                    <PasswordSwitcher
                      isShow={isShowConfirmPassword}
                      onClick={onShowConfirmPassword}
                    />
                  }
                  {...field}
                  isError={!!error}
                  errorMessages={error?.message}
                  isDisabled={isSubmitting}
                  onChange={handleClearErrorMessage(
                    'confirmPassword',
                    !!error,
                    field.onChange,
                  )}
                />
              )}
            />

            <Flex gap={3}>
              <Controller
                control={control}
                rules={AUTH_SCHEMA.AGREE_POLICY}
                name="isAcceptPrivacyPolicy"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Checkbox
                    size="md"
                    isChecked={value}
                    isDisabled={isSubmitting}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onChange(e.target.checked)
                    }
                    {...(error && {
                      sx: {
                        '> span': {
                          borderColor: 'danger.400',
                        },
                      },
                    })}
                  >
                    <Text
                      color="text.secondary"
                      fontSize={{ base: 'xs', md: 'md' }}
                      flex={1}
                      px={4}
                    >
                      By creating an account, you&apos;re agreeing to our {''}
                      <ChakraLink
                        href="#"
                        color="text.textDarkCheckbox"
                        cursor="pointer"
                      >
                        Privacy Policy
                      </ChakraLink>
                      , and {''}
                      <ChakraLink
                        href="#"
                        color="text.textDarkCheckbox"
                        cursor="pointer"
                      >
                        Electronics Communication Policy.
                      </ChakraLink>
                    </Text>
                  </Checkbox>
                )}
              />
            </Flex>
          </>
        )}
      </VStack>

      {/* Show API error */}
      <Box mb={7}>
        <Text color="red" textAlign="center" py={2} h={10}>
          {root?.message}
        </Text>
        <Button
          type="submit"
          role="button"
          aria-label={!isRegister ? 'Sign In' : 'Sign Up'}
          colorScheme="primary"
          bg="primary.300"
          textTransform="capitalize"
          form={!isRegister ? 'login-form' : 'register-form'}
          isDisabled={isDisabledSubmitBtn}
          isLoading={isSubmitting}
        >
          {!isRegister ? 'Sign In' : 'Sign Up'}
        </Button>
      </Box>

      <Flex justifyContent="center">
        <Text
          fontWeight="medium"
          textAlign="center"
          dangerouslySetInnerHTML={{
            __html: !isRegister
              ? 'Don&apos;t have an account?'
              : 'Already have an account?',
          }}
        />
        <Button
          as={Link}
          isDisabled={isSubmitting}
          href={!isRegister ? `/${ROUTES.REGISTER}` : `/${ROUTES.LOGIN}`}
          aria-label={!isRegister ? 'sign up' : 'sign in'}
          w="fit-content"
          py={0}
          _hover={{
            bg: 'transparent',
          }}
          color="text.primary"
          bg="transparent"
          fontWeight="semibold"
          textDecoration="underline"
          ml={2}
          onClick={handleClickSubmit}
        >
          {!isRegister ? 'Sign Up' : 'Sign In'}
        </Button>
      </Flex>
      <AuthFooter />
    </Box>
  );
};

const AuthFormMemorized = memo(AuthForm);

export default AuthFormMemorized;
