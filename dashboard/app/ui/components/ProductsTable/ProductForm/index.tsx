'use client';

// Libs
import { memo, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import isEqual from 'react-fast-compare';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';

// Components
import { UploadImages, InputField } from '@/ui/components';

// Interfaces
import { TProductRequest, TProductResponse } from '@/lib/interfaces';

// Constants
import { AUTH_SCHEMA, CURRENCY_PRODUCT, STATUS_SUBMIT } from '@/lib/constants';

// Hooks
import { useUploadProductImageFiles } from '@/lib/hooks';

// Utils
import { formatAmountNumber } from '@/lib/utils';

interface ProductProps {
  data?: TProductResponse;
  onCloseModal: () => void;
  onSubmit?: (product: TProductRequest, imageFiles: File[]) => void;
}

const ProductForm = ({ data, onSubmit, onCloseModal }: ProductProps) => {
  const { product } = data || {};
  const {
    _id = '',
    name = '',
    imageURLs = [],
    currency = '',
    amount = '',
    stock = '',
    description = '',
    createdAt = '',
  } = product || {};

  const {
    getRootProps,
    getInputProps,
    isFileDialogActive,
    handleRemoveImage,
    previewURLs,
    imageFiles,
    isImagesDirty,
  } = useUploadProductImageFiles(imageURLs);

  const {
    control,
    formState: { isDirty },
    clearErrors,
    handleSubmit,
    reset,
  } = useForm<TProductRequest>({
    defaultValues: {
      _id: _id,
      name: name,
      imageURLs: imageURLs,
      currency: currency || CURRENCY_PRODUCT,
      amount: amount,
      stock: stock,
      description: description,
      createdAt: createdAt,
    },
  });

  const disabled = useMemo(
    () => !(isDirty || isImagesDirty) || status === STATUS_SUBMIT.PENDING,
    [isDirty, isImagesDirty],
  );

  const handleChangeValue = useCallback(
    <T,>(field: keyof TProductRequest, changeHandler: (value: T) => void) =>
      (data: T) => {
        clearErrors(field);
        changeHandler(data);
      },
    [clearErrors],
  );

  const handleSubmitForm = useCallback(
    (data: TProductRequest) => {
      onSubmit && onSubmit(data, imageFiles);
      onCloseModal();
      reset();
    },
    [onSubmit, imageFiles, onCloseModal, reset],
  );

  return (
    <VStack
      as="form"
      id="update-product-form"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <Flex w={{ base: '100%' }} flexDirection={{ base: 'column', md: 'row' }}>
        <Flex mb={{ base: 5, sm: 5 }} w="100%">
          <Controller
            control={control}
            rules={AUTH_SCHEMA.NAME}
            name="name"
            render={({ field, field: { onChange }, fieldState: { error } }) => (
              <InputField
                variant="authentication"
                bg="background.body.primary"
                label="Name"
                mr={{ md: 2 }}
                {...field}
                isError={!!error}
                errorMessages={error?.message}
                onChange={handleChangeValue('name', onChange)}
                data-testid="edit-field-name"
              />
            )}
          />
        </Flex>
        <Flex mb={{ base: 5, sm: 5 }} w="100%">
          <Controller
            control={control}
            rules={AUTH_SCHEMA.AMOUNT}
            name="amount"
            defaultValue=""
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              const handleChange = (
                event: React.ChangeEvent<HTMLInputElement>,
              ) => {
                const value: string = event.target.value;

                if (isNaN(+value.replaceAll(',', ''))) return;

                // Remove non-numeric characters and leading zeros
                const sanitizedValue = formatAmountNumber(value);

                onChange(sanitizedValue);
              };

              return (
                <FormControl isInvalid={!!error}>
                  <FormLabel
                    color="text.secondary"
                    marginInlineEnd={0}
                    minW="max-content"
                  >
                    Price
                  </FormLabel>
                  <Input
                    bg="background.body.primary"
                    variant="authentication"
                    type="text"
                    placeholder="0.00"
                    color="text.primary"
                    fontSize="1xl"
                    value={formatAmountNumber(value?.toString())}
                    name="amount"
                    onChange={handleChange}
                    autoComplete="off"
                    position="static"
                    isInvalid={!!error}
                    data-testid="field-amount"
                  />
                  {!!error && (
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  )}
                </FormControl>
              );
            }}
          />
        </Flex>
      </Flex>
      <Flex w={{ base: '100%' }} flexDirection={{ base: 'column', md: 'row' }}>
        <Flex w="100%" mb={{ base: 5, sm: 5 }}>
          <Controller
            control={control}
            rules={AUTH_SCHEMA.QUANTITY}
            name="stock"
            defaultValue=""
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              const handleChange = (
                event: React.ChangeEvent<HTMLInputElement>,
              ) => {
                const value: string = event.target.value;

                if (isNaN(+value.replaceAll(',', ''))) return;

                // Remove non-numeric characters and leading zeros
                const sanitizedValue = formatAmountNumber(value);

                onChange(sanitizedValue);
              };

              return (
                <FormControl isInvalid={!!error} mr={{ md: 2 }} mb={{ sm: 2 }}>
                  <FormLabel
                    color="text.secondary"
                    marginInlineEnd={0}
                    minW="max-content"
                  >
                    Quantity
                  </FormLabel>
                  <Input
                    bg="background.body.primary"
                    variant="authentication"
                    type="text"
                    placeholder="0"
                    color="text.primary"
                    fontSize="1xl"
                    value={formatAmountNumber(value?.toString())}
                    name="quantity"
                    onChange={handleChange}
                    autoComplete="off"
                    position="static"
                    isInvalid={!!error}
                    data-testid="field-quantity"
                  />
                  {!!error && (
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  )}
                </FormControl>
              );
            }}
          />
        </Flex>
        <Flex w="100%" mb={{ sm: 5 }}>
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState: { error } }) => (
              <InputField
                variant="authentication"
                bg="background.body.primary"
                label="Description"
                {...field}
                isError={!!error}
                errorMessages={error?.message}
                onChange={handleChangeValue('description', field.onChange)}
              />
            )}
          />
        </Flex>
      </Flex>

      <Controller
        control={control}
        name="currency"
        render={({ field, fieldState: { error } }) => (
          <InputField
            variant="authentication"
            bg="background.body.primary"
            label="Currency"
            {...field}
            isError={!!error}
            errorMessages={error?.message}
            onChange={handleChangeValue('currency', field.onChange)}
            isDisabled
            defaultValue={CURRENCY_PRODUCT}
          />
        )}
      />

      <Controller
        control={control}
        name="imageURLs"
        render={() => (
          <FormControl>
            <UploadImages
              label="Gallery Thumbnail"
              previewURLs={previewURLs}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isFileDialogActive={isFileDialogActive}
              onRemove={handleRemoveImage}
            />
          </FormControl>
        )}
      />

      <Flex
        w="100%"
        my={4}
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        wrap="wrap"
        gap={3}
      >
        <Button
          type="submit"
          form="update-product-form"
          data-testid="submit-product-form"
          w={{ md: 240 }}
          bg="green.600"
          isDisabled={disabled}
        >
          Save
        </Button>
        <Button
          w={{ md: 240 }}
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

const ProductFormMemorized = memo(ProductForm, isEqual);
export default ProductFormMemorized;
