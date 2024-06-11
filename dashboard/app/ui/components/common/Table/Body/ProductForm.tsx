'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import isEqual from 'react-fast-compare';

// Components
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import InputField from '@/ui/components/common/InputField';
import { UploadImages } from '@/ui/components';

// Interfaces
import {
  IUploadImageResponse,
  TProductRequest,
  TProductResponse,
} from '@/lib/interfaces';

// Constants
import {
  AUTH_SCHEMA,
  CURRENCY_PRODUCT,
  ERROR_MESSAGES,
  LIMIT_PRODUCT_IMAGES,
  REGEX,
  STATUS,
  STATUS_SUBMIT,
} from '@/lib/constants';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import { useUploadImage, useUploadProductImageFiles } from '@/lib/hooks';

// Utils
import {
  customToast,
  formatAmountNumber,
  parseFormattedNumber,
} from '@/lib/utils';

interface ProductProps {
  data?: TProductResponse;
  onCreateProduct?: (productData: Omit<TProductRequest, 'id'>) => void;
  onUpdateProduct?: (productData: TProductRequest) => void;
  onCloseModal?: () => void;
}

const ProductForm = ({
  data,
  onCreateProduct,
  onUpdateProduct,
  onCloseModal,
}: ProductProps) => {
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

  const toast = useToast();
  // const [previewURLs, setPreviewURL] = useState<string[]>(imageURLs || []);
  // const [imageFiles, setImageFiles] = useState<File[]>([]);
  // const [isImagesDirty, setIsImagesDirty] = useState(false);

  const { uploadImage } = useUploadImage();

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
  const userId = authStore((state) => state.user?.id);

  const disabled = useMemo(
    () => !(isDirty || isImagesDirty) || status === STATUS_SUBMIT.PENDING,
    [isDirty, isImagesDirty],
  );

  const handleShowErrorMessage = useCallback(
    (message: string) => {
      toast(customToast('', message, STATUS.ERROR));
    },
    [toast],
  );

  // const handleFilesChange = useCallback(
  //   (files: File[]) => {
  //     const imagesPreview: React.SetStateAction<string[]> = [];

  //     if (files.length > LIMIT_PRODUCT_IMAGES) {
  //       return handleShowErrorMessage(ERROR_MESSAGES.UPLOAD_IMAGE_ITEM);
  //     }

  //     files.map(async (file) => {
  //       if (!file) {
  //         return;
  //       }

  //       // Check type of image
  //       if (!REGEX.IMG.test(file.name)) {
  //         return handleShowErrorMessage(ERROR_MESSAGES.UPLOAD_IMAGE);
  //       }

  //       const previewImage: string = URL.createObjectURL(file);
  //       imagesPreview.push(previewImage);
  //     });

  //     setImageFiles(files);
  //     setPreviewURL(imagesPreview);
  //     setIsImagesDirty(true);
  //   },
  //   [handleShowErrorMessage],
  // );

  // const handleRemoveImage = useCallback(
  //   (index: number) => {
  //     const updatedImages = [...previewURLs];
  //     updatedImages.splice(index, 1);

  //     setPreviewURL(updatedImages);
  //     setIsImagesDirty(true);
  //   },
  //   [previewURLs],
  // );

  const handleChangeValue = useCallback(
    <T,>(field: keyof TProductRequest, changeHandler: (value: T) => void) =>
      (data: T) => {
        clearErrors(field);
        changeHandler(data);
      },
    [clearErrors],
  );

  const handleUploadImageError = useCallback(() => {
    handleShowErrorMessage(ERROR_MESSAGES.UPDATE_FAIL.title);
  }, [handleShowErrorMessage]);

  const handleSubmitForm = useCallback(
    async (data: TProductRequest) => {
      const imagesUpload: string[] = [];

      await Promise.all(
        imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);

          uploadImage(formData, {
            onSuccess: (res: AxiosResponse<IUploadImageResponse>) => {
              console.log('res?', res);

              const { data } = res?.data || {};
              const { url: imageURL = '' } = data || {};

              imagesUpload.push(imageURL);
            },
            onError: handleUploadImageError,
          });
        }),
      );

      const requestData = {
        ...data,
        imageURLs: imagesUpload.length ? imagesUpload : previewURLs,
        stock: parseFormattedNumber(data.stock).toString(),
        amount: parseFormattedNumber(data.amount).toString(),
        userId,
      };

      console.log(' requestData.imageURLs', requestData.imageURLs);
      data._id
        ? onUpdateProduct && onUpdateProduct(requestData)
        : onCreateProduct && onCreateProduct(requestData);
      reset(requestData);
      onCloseModal && onCloseModal();
    },
    [
      handleUploadImageError,
      imageFiles,
      onCloseModal,
      onCreateProduct,
      onUpdateProduct,
      previewURLs,
      reset,
      uploadImage,
      userId,
    ],
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
              // onChange={handleFilesChange}
              onRemove={handleRemoveImage}
            />
          </FormControl>
        )}
      />

      <Flex my={4}>
        <Button
          type="submit"
          form="update-product-form"
          data-testid="submit-product-form"
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

const ProductFormMemorized = memo(ProductForm, isEqual);
export default ProductFormMemorized;
