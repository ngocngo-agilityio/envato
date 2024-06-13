'use client';

import { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  useToast,
  VStack,
} from '@chakra-ui/react';

// Components
import { CustomerIssues, InputField } from '@/ui/components';

// Constants
import {
  AUTH_SCHEMA,
  ERROR_MESSAGES,
  REGEX,
  STATUS,
  STATUS_SUBMIT,
  SUCCESS_MESSAGES,
} from '@/lib/constants';

// Hooks
import { useCreateIssues, useGetListIssues } from '@/lib/hooks';

// Stores
import { authStore } from '@/lib/stores';

// Utils
import { customToast, formatAllowOnlyNumbers } from '@/lib/utils';

// Interfaces
import { TUserDetail } from '@/lib/interfaces';

// Themes
import { useColorfill } from '@/ui/themes/bases';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Supports = () => {
  const toast = useToast();
  const user = authStore((state) => state.user);
  const {
    id = '',
    email = '',
    firstName = '',
    lastName = '',
    phoneNumber = '',
    title = '',
    description = '',
  } = (user as TUserDetail) || {};

  const {
    data: listIssue,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useGetListIssues();

  const { mutate: createIssues, status, isPending } = useCreateIssues();

  const {
    control,
    formState: { isDirty },
    clearErrors,
    handleSubmit,
    reset,
    watch,
  } = useForm<TUserDetail>({
    defaultValues: {
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      title: title,
      description: description,
    },
  });

  const hasTitle = watch('title')?.trim();
  const hasDescription = watch('description')
    ?.replace(REGEX.HTML_TAG_PATTERN, '')
    ?.trim();

  const disabled = useMemo(
    () =>
      !isDirty ||
      status === STATUS_SUBMIT.PENDING ||
      !hasTitle ||
      !hasDescription,
    [isDirty, status, hasTitle, hasDescription],
  );

  const { quinary } = useColorfill();

  const handleChangeValue = useCallback(
    <T,>(field: keyof TUserDetail, changeHandler: (value: T) => void) =>
      (data: T) => {
        clearErrors(field);
        changeHandler(data);
      },
    [clearErrors],
  );

  const handleSubmitForm = useCallback(
    ({ title, description }: TUserDetail) => {
      createIssues(
        {
          userId: id,
          firstName,
          lastName,
          email: email,
          phone: phoneNumber,
          title: title,
          description: description,
        },
        {
          onSuccess: () => {
            toast(
              customToast(
                SUCCESS_MESSAGES.CREATE_ISSUES.title,
                SUCCESS_MESSAGES.CREATE_ISSUES.description,
                STATUS.SUCCESS,
              ),
            );
            reset({
              title: '',
              description: '',
            });
          },
          onError: () => {
            toast(
              customToast(
                ERROR_MESSAGES.CREATE_ISSUES_FAIL.title,
                ERROR_MESSAGES.CREATE_ISSUES_FAIL.description,
                STATUS.ERROR,
              ),
            );
          },
        },
      );
    },
    [createIssues, email, firstName, id, lastName, phoneNumber, reset, toast],
  );

  return (
    <Flex
      flexDirection={{ base: 'column', xl: 'row' }}
      justifyContent="space-between"
      bg="background.body.quaternary"
      m={{ base: 5, xl: 10 }}
      w={{ '2xl': '80%', '7xl': '70%' }}
      borderRadius={8}
      py={12}
      px={{ base: 6, xl: 12 }}
    >
      <Box>
        <VStack
          as="form"
          id="register-form"
          alignItems="start"
          mr={{ xl: 5 }}
          mb={{ base: 10, xl: 0 }}
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <Flex
            justifyContent="space-between"
            flexDirection={{ base: 'column', lg: 'row' }}
            w="full"
          >
            <Controller
              control={control}
              rules={AUTH_SCHEMA.FIRST_NAME}
              name="firstName"
              render={({ field, fieldState: { error } }) => (
                <InputField
                  variant="tertiary"
                  bg="background.body.primary"
                  label="First Name"
                  minW={285}
                  w="full"
                  mb={2}
                  mr={{ lg: 10 }}
                  {...field}
                  isError={!!error}
                  errorMessages={error?.message}
                  isDisabled={isPending}
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
                  w="full"
                  minW={285}
                  {...field}
                  isError={!!error}
                  errorMessages={error?.message}
                  isDisabled={isPending}
                />
              )}
            />
          </Flex>
          <Flex flexDirection={{ base: 'column', lg: 'row' }} w="full">
            <Controller
              control={control}
              rules={AUTH_SCHEMA.EMAIL}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <InputField
                  variant="tertiary"
                  bg="background.body.primary"
                  label="Email"
                  w="full"
                  minW={285}
                  mb={2}
                  mr={{ lg: 10 }}
                  {...field}
                  isError={!!error}
                  errorMessages={error?.message}
                  isDisabled={isPending}
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
                  w="full"
                  minW={285}
                  {...field}
                  isError={!!error}
                  errorMessages={error?.message}
                  value={formatAllowOnlyNumbers(field.value)}
                  isDisabled={isPending}
                />
              )}
            />
          </Flex>
          <Text
            fontSize="xl"
            color="text.primary"
            mt={10}
            fontWeight="bold"
            textAlign="start"
          >
            Support issues
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field, field: { onChange }, fieldState: { error } }) => (
              <InputField
                variant="tertiary"
                bg="background.body.primary"
                label="Title"
                w="full"
                minW={285}
                {...field}
                isError={!!error}
                errorMessages={error?.message}
                onChange={handleChangeValue('title', onChange)}
                isDisabled={isPending}
              />
            )}
          />
          <Flex direction="column" width="full" mt={5}>
            <Text fontWeight="semibold" mb={2}>
              Description
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, ...rest } }) => (
                <FormControl>
                  <Flex
                    direction="row"
                    alignItems="center"
                    justify="flex-start"
                  >
                    <ReactQuill
                      {...rest}
                      onChange={handleChangeValue('description', onChange)}
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline'],
                          ['image', 'code-block'],
                        ],
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: quinary,
                        height: 300,
                      }}
                      theme="snow"
                      readOnly={isPending}
                    />
                  </Flex>
                </FormControl>
              )}
            />
          </Flex>
          <Button
            type="submit"
            bg="primary.300"
            aria-label="btn submit-ticket"
            data-testid="btn-create-issues"
            mt={12}
            w={200}
            isDisabled={disabled}
            isLoading={isPending}
          >
            Submit Ticket
          </Button>
        </VStack>
      </Box>
      <CustomerIssues
        isFetching={isFetching}
        isDisabled={isFetchingNextPage}
        dataList={listIssue}
        onLoadMore={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </Flex>
  );
};

export default Supports;
