'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { AxiosResponse } from 'axios';
import {
  HStack,
  VStack,
  Text,
  Heading,
  Grid,
  GridItem,
  Button,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';

// Components
import { Indicator, InputField, UpdateProfile } from '@/ui/components';

// Constants
import {
  ERROR_MESSAGES,
  STATUS_SUBMIT,
  SUCCESS_MESSAGES,
  AUTH_SCHEMA,
  STATUS,
} from '@/lib/constants';

// Hooks
import { useAuth, useUpdateUser } from '@/lib/hooks';

// Stores
import { authStore } from '@/lib/stores';

// Utils
import { customToast, formatAllowOnlyNumbers } from '@/lib/utils';

// Providers
import { QueryProvider } from '@/ui/providers';

// Hooks
import { useUploadImage } from '@/lib/hooks';

// Interfaces
import { IUploadImageResponse, TUserDetail } from '@/lib/interfaces';

const UserForm = () => {
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);

  const { setUser } = useAuth();
  const user = authStore((state) => state.user);
  const { mutate: updateUser, status, isPending: isSubmit } = useUpdateUser();
  const toast = useToast();
  const { uploadImage } = useUploadImage();

  const {
    id = '',
    avatarURL = '',
    email = '',
    firstName = '',
    lastName = '',
    phoneNumber = '',
    country = '',
    city = '',
    address = '',
    postalCode = '',
    facebookURL = '',
    linkedinURL = '',
    twitterURL = '',
    youtubeURL = '',
  } = user || {};

  const {
    control,
    formState: {
      errors: { root },
      isValid,
      isDirty,
    },
    clearErrors,
    handleSubmit,
    reset,
  } = useForm<TUserDetail>({
    defaultValues: {
      id: id,
      avatarURL: avatarURL,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      country: country,
      city: city,
      address: address,
      postalCode: postalCode,
      facebookURL: facebookURL,
      linkedinURL: linkedinURL,
      twitterURL: twitterURL,
      youtubeURL: youtubeURL,
    },
    mode: 'onBlur',
  });

  const handleAvatarChange = useCallback((avatarFile: File) => {
    setAvatarFile(avatarFile);
    setIsAvatarDirty(true);
  }, []);

  const handleShowErrorMessage = useCallback(
    (message: string) => {
      toast(customToast('', message, STATUS.ERROR));
    },
    [toast],
  );

  const handleUpdateUser = useCallback(
    (updatedInfo: TUserDetail) => {
      updateUser(updatedInfo, {
        onSuccess: (response: AxiosResponse<TUserDetail>) => {
          const updatedUser: TUserDetail = {
            ...response.data,
            id: response.data._id || '',
          };

          setUser({ user: updatedUser });
          setIsAvatarDirty(false);

          toast(
            customToast(
              SUCCESS_MESSAGES.UPDATE_SUCCESS.title,
              SUCCESS_MESSAGES.UPDATE_SUCCESS.description,
              STATUS.SUCCESS,
            ),
          );

          reset(updatedInfo);
        },
        onError: () => {
          setIsAvatarDirty(false);

          toast(
            customToast(
              ERROR_MESSAGES.UPDATE_FAIL.title,
              ERROR_MESSAGES.UPDATE_FAIL.description,
              STATUS.ERROR,
            ),
          );
        },
      });
    },
    [reset, setUser, toast, updateUser],
  );

  const handleUploadAvatarError = useCallback(() => {
    handleShowErrorMessage(ERROR_MESSAGES.UPDATE_FAIL.title);
  }, [handleShowErrorMessage]);

  const handleSubmitForm = useCallback(
    (userInfo: TUserDetail) => {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('image', avatarFile);

        return uploadImage(formData, {
          onSuccess: (res: AxiosResponse<IUploadImageResponse>) => {
            const { data } = res?.data || {};
            const { url: imageURL = '' } = data || {};

            const updatedInfo = {
              ...userInfo,
              avatarURL: imageURL,
            };

            handleUpdateUser(updatedInfo);
          },
          onError: handleUploadAvatarError,
        });
      }

      handleUpdateUser(userInfo);
    },
    [avatarFile, handleUpdateUser, handleUploadAvatarError, uploadImage],
  );

  const handleChangeValue = useCallback(
    <T,>(field: keyof TUserDetail, changeHandler: (value: T) => void) =>
      (data: T) => {
        clearErrors(field);
        changeHandler(data);
      },
    [clearErrors],
  );

  const disabled = useMemo(
    () =>
      !(isDirty || isAvatarDirty) ||
      !isValid ||
      status === STATUS_SUBMIT.PENDING,
    [isAvatarDirty, isDirty, isValid, status],
  );

  return (
    <Indicator isOpen={isSubmit}>
      <VStack
        as="form"
        id="register-form"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <Grid
          width="full"
          gridTemplateColumns={{
            xl: 'repeat(12,minmax(0,1fr))',
          }}
          gap={12}
          display={{
            base: 'flex',
            xl: 'grid',
          }}
          flexDirection={{
            base: 'column-reverse',
          }}
        >
          <GridItem
            order={-1}
            as="section"
            w={{
              base: '100%',
              md: 'unset',
            }}
            bg="background.body.quaternary"
            colSpan={7}
          >
            <Heading
              as="h3"
              textTransform="capitalize"
              mb={5}
              pb={5}
              borderBottom="1px solid"
              borderColor=" border.quinary"
              color="text.quinary"
              fontSize="2xl"
            >
              personal information&apos;s
            </Heading>

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
              mb={6}
            >
              <Controller
                control={control}
                rules={AUTH_SCHEMA.FIRST_NAME}
                name="firstName"
                render={({
                  field,
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="First Name"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('firstName', onChange)}
                  />
                )}
              />
              <Controller
                control={control}
                rules={AUTH_SCHEMA.LAST_NAME}
                name="lastName"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Last Name"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('lastName', field.onChange)}
                  />
                )}
              />
            </HStack>

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
                rules={AUTH_SCHEMA.EMAIL}
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Email"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('email', field.onChange)}
                    isDisabled
                  />
                )}
              />

              <Controller
                control={control}
                rules={AUTH_SCHEMA.PHONE_NUMBER}
                name="phoneNumber"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Phone Number (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    value={formatAllowOnlyNumbers(field.value)}
                    onChange={handleChangeValue('phoneNumber', field.onChange)}
                  />
                )}
              />
            </HStack>

            <Heading w="full" textAlign="left" pt={8} pb={6}>
              Personal Address
            </Heading>

            <HStack
              gap={{
                base: 6,
                md: 10,
              }}
              w="100%"
              flexDirection={{
                base: 'column',
                md: 'unset',
              }}
              mb={6}
            >
              <Controller
                control={control}
                name="country"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Country and Region (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('country', field.onChange)}
                  />
                )}
              />

              <Controller
                control={control}
                name="city"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="City (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('city', field.onChange)}
                  />
                )}
              />
            </HStack>

            <HStack
              gap={{
                base: 6,
                md: 10,
              }}
              w="100%"
              flexDirection={{
                base: 'column',
                md: 'unset',
              }}
            >
              <Controller
                control={control}
                name="address"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Address (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('address', field.onChange)}
                  />
                )}
              />

              <Controller
                control={control}
                name="postalCode"
                render={({
                  field,
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Postal Code (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('postalCode', onChange)}
                  />
                )}
              />
            </HStack>

            <Heading w="full" textAlign="left" pt={8} pb={6}>
              Social Information
            </Heading>

            <HStack
              gap={{
                base: 6,
                md: 10,
              }}
              w="100%"
              flexDirection={{
                base: 'column',
                md: 'unset',
              }}
              mb={6}
            >
              <Controller
                control={control}
                rules={AUTH_SCHEMA.FACEBOOK}
                name="facebookURL"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Facebook (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('facebookURL', field.onChange)}
                  />
                )}
              />

              <Controller
                control={control}
                rules={AUTH_SCHEMA.TWITTER}
                name="twitterURL"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Twitter (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('twitterURL', field.onChange)}
                  />
                )}
              />
            </HStack>

            <HStack
              gap={{
                base: 6,
                md: 10,
              }}
              w="100%"
              flexDirection={{
                base: 'column',
                md: 'unset',
              }}
            >
              <Controller
                control={control}
                rules={AUTH_SCHEMA.LINKEDIN}
                name="linkedinURL"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Linkedin (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('linkedinURL', field.onChange)}
                  />
                )}
              />

              <Controller
                control={control}
                rules={AUTH_SCHEMA.YOUTUBE}
                name="youtubeURL"
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    variant="tertiary"
                    bg="background.body.primary"
                    label="Youtube (optional)"
                    {...field}
                    isError={!!error}
                    errorMessages={error?.message}
                    onChange={handleChangeValue('youtubeURL', field.onChange)}
                  />
                )}
              />
            </HStack>

            <GridItem mb={7}>
              <Text color="red" textAlign="center" py={2} h={10}>
                {root?.message}
              </Text>

              <Flex direction="row-reverse">
                <Button
                  type="submit"
                  data-testid="click-button-update-profile"
                  aria-label="btn-save-profile"
                  bg="primary.300"
                  px={4}
                  textTransform="capitalize"
                  form="register-form"
                  isDisabled={disabled}
                  w="none"
                >
                  Save Profile
                </Button>
              </Flex>
            </GridItem>
          </GridItem>

          <GridItem order={1} colSpan={5}>
            <UpdateProfile
              onUploadError={handleShowErrorMessage}
              control={control}
              onFileChange={handleAvatarChange}
            />
          </GridItem>
        </Grid>
      </VStack>
    </Indicator>
  );
};

const WrappedUserForm = () => (
  <QueryProvider>
    <UserForm />
  </QueryProvider>
);

const UserFormMemorized = memo(WrappedUserForm);

export default UserFormMemorized;
