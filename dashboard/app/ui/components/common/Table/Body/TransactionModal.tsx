'use client';

import { memo, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import isEqual from 'react-fast-compare';

// Components
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import InputField from '@/ui/components/common/InputField';

// Interfaces
import { TCustomer, TTransaction } from '@/lib/interfaces';

// Constants
import { AUTH_SCHEMA, STATUS_SUBMIT } from '@/lib/constants';

interface TransactionProps {
  isDelete?: boolean;
  transaction: Partial<TTransaction & TCustomer & { id: string }>;
  onDeleteTransaction?: () => void;
  onUpdateTransaction?: (transactionData: TTransaction) => void;
  onCloseModal?: () => void;
}

const TransactionModal = ({
  isDelete = false,
  transaction,
  onDeleteTransaction,
  onUpdateTransaction,
  onCloseModal,
}: TransactionProps) => {
  const { id = '', customer } = transaction || {};
  const { firstName = '', lastName = '', address = '' } = customer || {};
  const { state = '', street = '', city = '', zip = 0 } = address || {};

  const {
    control,
    formState: { isDirty },
    clearErrors,
    handleSubmit,
    reset,
  } = useForm<TTransaction>({
    defaultValues: {
      _id: id,
      customer: {
        firstName: firstName,
        lastName: lastName,
        address: {
          state: state,
          street: street,
          city: city,
          zip: zip,
        },
      },
    },
  });

  const disabled = useMemo(
    () =>
      isDelete
        ? status === STATUS_SUBMIT.PENDING
        : !isDirty || status === STATUS_SUBMIT.PENDING,
    [isDirty, isDelete],
  );

  const handleChangeValue = useCallback(
    <T,>(field: keyof TTransaction, changeHandler: (value: T) => void) =>
      (data: T) => {
        clearErrors(field);
        changeHandler(data);
      },
    [clearErrors],
  );

  const handleSubmitForm = useCallback(
    (updateData: TTransaction) => {
      onUpdateTransaction && onUpdateTransaction(updateData);
      reset(updateData);
      onCloseModal && onCloseModal();
    },
    [onCloseModal, onUpdateTransaction, reset],
  );

  return isDelete ? (
    <Box>
      <Text fontSize="lg">
        Are you sure delete the transaction with id:
        <Text as="span" pl={1} color="red.500" fontWeight="bold">
          {id}
        </Text>
        ?
      </Text>
      <Flex my={4} justifyContent="center">
        <Button
          w={44}
          bg="green.600"
          mr={3}
          isDisabled={disabled}
          onClick={onDeleteTransaction}
          data-testid="accept-del"
        >
          Delete
        </Button>
        <Button
          w={44}
          bg="orange.300"
          _hover={{ bg: 'orange.400' }}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  ) : (
    <VStack
      as="form"
      id="update-transaction-form"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <Flex mb={2}>
        <Controller
          control={control}
          rules={AUTH_SCHEMA.FIRST_NAME}
          name="customer.firstName"
          render={({ field, field: { onChange }, fieldState: { error } }) => (
            <InputField
              variant="authentication"
              bg="background.body.primary"
              label="First Name"
              mr={2}
              {...field}
              isError={!!error}
              errorMessages={error?.message}
              // TODO: Will update later
              onChange={handleChangeValue('customer', onChange)}
              data-testid="edit-field-name"
            />
          )}
        />
        <Controller
          control={control}
          rules={AUTH_SCHEMA.LAST_NAME}
          name="customer.lastName"
          render={({ field, fieldState: { error } }) => (
            <InputField
              variant="authentication"
              bg="background.body.primary"
              label="Last Name"
              {...field}
              isError={!!error}
              errorMessages={error?.message}
              // TODO: Will update later
              onChange={handleChangeValue('customer', field.onChange)}
            />
          )}
        />
      </Flex>
      <Flex mb={2}>
        <Controller
          control={control}
          rules={AUTH_SCHEMA.STREET}
          name="customer.address.street"
          render={({ field, field: { onChange }, fieldState: { error } }) => (
            <InputField
              variant="authentication"
              bg="background.body.primary"
              label="Street"
              mr={2}
              {...field}
              isError={!!error}
              errorMessages={error?.message}
              // TODO: Will update later
              onChange={handleChangeValue('customer', onChange)}
            />
          )}
        />
        <Controller
          control={control}
          rules={AUTH_SCHEMA.STATE}
          name="customer.address.state"
          render={({ field, fieldState: { error } }) => (
            <InputField
              variant="authentication"
              bg="background.body.primary"
              label="State"
              {...field}
              isError={!!error}
              errorMessages={error?.message}
              // TODO: Will update later
              onChange={handleChangeValue('customer', field.onChange)}
            />
          )}
        />
      </Flex>
      <Flex mb={2}>
        <Controller
          control={control}
          rules={AUTH_SCHEMA.CITY}
          name="customer.address.city"
          render={({ field, field: { onChange }, fieldState: { error } }) => (
            <InputField
              variant="authentication"
              bg="background.body.primary"
              label="City"
              mr={2}
              {...field}
              isError={!!error}
              errorMessages={error?.message}
              // TODO: Will update later
              onChange={handleChangeValue('customer', onChange)}
            />
          )}
        />
        <Controller
          control={control}
          rules={AUTH_SCHEMA.ZIP_CODE}
          name="customer.address.zip"
          render={({ field, fieldState: { error } }) => (
            <InputField
              variant="authentication"
              bg="background.body.primary"
              label="Zip"
              {...field}
              isError={!!error}
              errorMessages={error?.message}
              // TODO: Will update later
              onChange={handleChangeValue('customer', field.onChange)}
            />
          )}
        />
      </Flex>
      <Flex my={4}>
        <Button
          type="submit"
          form="update-transaction-form"
          data-testid="submit-transaction-form"
          w={44}
          bg="green.600"
          mr={3}
          isDisabled={disabled}
        >
          Save
        </Button>
        <Button
          w={44}
          bg="orange.300"
          _hover={{ bg: 'orange.400' }}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
      </Flex>
    </VStack>
  );
};

const TransactionModalMemorized = memo(TransactionModal, isEqual);
export default TransactionModalMemorized;
