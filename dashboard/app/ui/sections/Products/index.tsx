'use client';

import { useCallback } from 'react';
import { InView } from 'react-intersection-observer';
import { Box, Flex, Grid, GridItem, useToast } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { AxiosResponse } from 'axios';

// Hooks
import { useProducts, useSearch, useUploadImages } from '@/lib/hooks';

// Stores
import { authStore } from '@/lib/stores';

// Types
import { IUploadImageResponse, TProductRequest } from '@/lib/interfaces';

// Utils
import { customToast, parseFormattedNumber } from '@/lib/utils';

// Constants
import { ERROR_MESSAGES, STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Components
import { ProductsTable } from '@/ui/components';

// dynamic loading components
const CardPayment = dynamic(() => import('@/ui/components/CardPayment'));
const BoxChat = dynamic(() => import('@/ui/components/BoxChat'));

const Products = () => {
  const toast = useToast();
  const { get, setSearchParam: setSearchTransaction } = useSearch();

  // Auth store
  const user = authStore((state) => state.user);

  // Upload images
  const { uploadImages, isPending: isLoadingUploadImages } = useUploadImages();

  // Products
  const {
    products,
    isLoading: isLoadingProducts,
    limit,
    currentPage,
    sortBy,
    createProduct,
    deleteProduct,
    updateProduct,
    resetPage,
    setCurrentPage,
    setLimit,
    isCreateProduct: isLoadingCreateProduct,
    isDeleteProduct: isLoadingDeleteProduct,
    isUpdateProduct: isLoadingUpdateProduct,
    isDisableNext,
    isDisablePrev,
    pageArray,
  } = useProducts({
    name: get('keyword')?.toLowerCase() || '',
  });

  const { id: userId = '' } = user || {};

  const handleSearchProduct = useCallback(
    (value: string) => {
      resetPage();
      setSearchTransaction('keyword', value);
    },
    [resetPage, setSearchTransaction],
  );

  const handleChangeProductLimit = useCallback(
    (limit: number) => {
      setLimit(limit);
      resetPage();
    },
    [resetPage, setLimit],
  );

  const handleCreateProduct = useCallback(
    (product: Omit<TProductRequest, '_id'>) => {
      createProduct(
        {
          ...product,
        },
        {
          onSuccess: () => {
            toast(
              customToast(
                SUCCESS_MESSAGES.CREATE_PRODUCT_SUCCESS.title,
                SUCCESS_MESSAGES.CREATE_PRODUCT_SUCCESS.description,
                STATUS.SUCCESS,
              ),
            );
          },
          onError: () => {
            toast(
              customToast(
                ERROR_MESSAGES.CREATE_PRODUCT_FAIL.title,
                ERROR_MESSAGES.CREATE_PRODUCT_FAIL.description,
                STATUS.ERROR,
              ),
            );
          },
        },
      );
    },
    [createProduct, toast],
  );

  const handleUpdateProduct = useCallback(
    (data: TProductRequest) => {
      updateProduct(
        {
          ...data,
          productId: data._id,
          userId,
        },
        {
          onSuccess: () => {
            toast(
              customToast(
                SUCCESS_MESSAGES.UPDATE_PRODUCT_SUCCESS.title,
                SUCCESS_MESSAGES.UPDATE_PRODUCT_SUCCESS.description,
                STATUS.SUCCESS,
              ),
            );
          },
          onError: () => {
            toast(
              customToast(
                ERROR_MESSAGES.UPDATE_PRODUCT_FAIL.title,
                ERROR_MESSAGES.UPDATE_PRODUCT_FAIL.description,
                STATUS.ERROR,
              ),
            );
          },
        },
      );
    },
    [toast, updateProduct, userId],
  );

  const handleUploadImageSuccess = useCallback(
    (
      product: TProductRequest,
      res: AxiosResponse<IUploadImageResponse>[] = [],
    ) => {
      const imagesUpload: string[] = [];

      const uploadedImages = res.map((resItem) => {
        const { data: productImageData } = resItem || {};
        const { data } = productImageData || {};
        const { url: imageURL = '' } = data || {};

        return imageURL;
      });

      imagesUpload.push(...uploadedImages);

      const requestData = {
        ...product,
        imageURLs: imagesUpload.length ? imagesUpload : product.imageURLs,
        stock: parseFormattedNumber(product.stock).toString(),
        amount: parseFormattedNumber(product.amount).toString(),
        userId,
      };

      product._id
        ? handleUpdateProduct(requestData)
        : handleCreateProduct(requestData);
    },
    [handleCreateProduct, handleUpdateProduct, userId],
  );

  const handleUploadImageError = useCallback(
    () =>
      toast(
        customToast(
          ERROR_MESSAGES.UPDATE_PRODUCT_FAIL.title,
          ERROR_MESSAGES.UPDATE_PRODUCT_FAIL.description,
          STATUS.ERROR,
        ),
      ),
    [toast],
  );

  const handleUploadImages = useCallback(
    (product: TProductRequest, imageFiles: File[]) => {
      const payload = imageFiles.map((imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        return formData;
      });

      uploadImages &&
        uploadImages(payload, {
          onSuccess: (res: AxiosResponse<IUploadImageResponse>[]) => {
            handleUploadImageSuccess(product, res);
          },
          onError: handleUploadImageError,
        });
    },
    [handleUploadImageError, handleUploadImageSuccess, uploadImages],
  );

  const handleDeleteProduct = useCallback(
    (id: string) => {
      deleteProduct(
        {
          productId: id,
          userId,
        },
        {
          onSuccess: () => {
            toast(
              customToast(
                SUCCESS_MESSAGES.DELETE_PRODUCT_SUCCESS.title,
                SUCCESS_MESSAGES.DELETE_PRODUCT_SUCCESS.description,
                STATUS.SUCCESS,
              ),
            );
          },
          onError: () => {
            toast(
              customToast(
                ERROR_MESSAGES.DELETE_PRODUCT_FAIL.title,
                ERROR_MESSAGES.DELETE_PRODUCT_FAIL.description,
                STATUS.ERROR,
              ),
            );
          },
        },
      );
    },
    [deleteProduct, toast, userId],
  );

  return (
    <Grid
      bg="background.body.primary"
      py={12}
      px={{ base: 6, xl: 12 }}
      templateColumns={{ base: 'repeat(1, 1fr)', '2xl': 'repeat(4, 1fr)' }}
      display={{ sm: 'block', md: 'grid' }}
      gap={{ base: 0, '2xl': 12 }}
    >
      <GridItem colSpan={3}>
        <Box
          as="section"
          bgColor="background.component.primary"
          borderRadius={8}
          px={6}
          py={5}
        >
          <ProductsTable
            isFetching={isLoadingProducts}
            products={products}
            limit={limit}
            currentPage={currentPage}
            isDisableNext={isDisableNext}
            isDisablePrev={isDisablePrev}
            pageArray={pageArray}
            isLoading={
              isLoadingUploadImages ||
              isLoadingCreateProduct ||
              isLoadingDeleteProduct ||
              isLoadingUpdateProduct
            }
            searchValue={get('keyword')?.toLowerCase() || ''}
            onSort={sortBy}
            onSearch={handleSearchProduct}
            onChangeLimit={handleChangeProductLimit}
            onChangePage={setCurrentPage}
            onDelete={handleDeleteProduct}
            onSubmitProductForm={handleUploadImages}
          />
        </Box>
      </GridItem>

      <InView>
        {({ inView, ref }) => (
          <GridItem mt={{ base: 6, '2xl': 0 }} ref={ref}>
            <Flex
              direction={{ base: 'column', lg: 'row', xl: 'column' }}
              gap={6}
            >
              {inView && <CardPayment />}
              {inView && <BoxChat />}
            </Flex>
          </GridItem>
        )}
      </InView>
    </Grid>
  );
};

export default Products;
