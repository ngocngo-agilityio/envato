'use client';

// Libs
import { memo, useCallback, useMemo, useState } from 'react';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';

// Constants
import {
  COLUMNS_PRODUCTS,
  STATUS_LABEL,
  FILTER_PRODUCT,
  PRODUCT_STATUS,
  PREV,
} from '@/lib/constants';

// Hooks
import { useDebounce } from '@/lib/hooks';

// Utils
import { formatProductResponse } from '@/lib/utils';

// Types
import {
  TProductRequest,
  THeaderTable,
  TProduct,
  TProductResponse,
  TProductSortField,
} from '@/lib/interfaces';

// Components
import {
  Table,
  Pagination,
  SearchBar,
  Fetching,
  ActionCell,
  StatusCell,
  Modal,
  Button,
  ProductForm,
  Indicator,
  HeadCell,
} from '@/ui/components';
import { TOption } from '../common/Select';
import GalleryCell from './GalleryCell';
import PriceCell from './PriceCell';
import QuantityCell from './QuantityCell';
import NameCell from './NameCell';

interface ProductsTableProps {
  isFetching: boolean;
  products: TProduct[];
  limit: number;
  currentPage: number;
  isDisableNext: boolean;
  isDisablePrev: boolean;
  pageArray: string[];
  isLoading: boolean;
  searchValue: string;
  onSort: (field: TProductSortField) => void;
  onSearch: (value: string) => void;
  onChangeLimit: (limit: number) => void;
  onChangePage: (page: number) => void;
  onSubmitProductForm: (product: TProductRequest, imageFiles: File[]) => void;
  onDelete: (id: string) => void;
}

const ProductsTable = ({
  isFetching,
  products,
  limit,
  currentPage,
  isDisableNext,
  isDisablePrev,
  pageArray,
  isLoading,
  searchValue,
  onSort,
  onSearch,
  onChangeLimit,
  onChangePage,
  onSubmitProductForm,
  onDelete,
}: ProductsTableProps) => {
  const [filter, setFilter] = useState<string>('');
  const { isOpen: isOpenAddModal, onToggle: onToggleAddModal } =
    useDisclosure();

  const productsMemorized = useMemo(
    () =>
      products?.filter(({ stock }) =>
        +stock > 0
          ? PRODUCT_STATUS.IN_STOCK.includes(filter.trim())
          : PRODUCT_STATUS.SOLD.includes(filter.trim()),
      ),
    [filter, products],
  );

  const handleDebounceSearch = useDebounce((value: string) => {
    onSearch(value);
  }, []);

  const handlePageChange = useCallback(
    (direction: string) => {
      onChangePage(direction === PREV ? currentPage - 1 : currentPage + 1);
    },
    [currentPage, onChangePage],
  );

  const handleChangeLimit = useCallback(
    (limit: TOption) => {
      onChangeLimit(+limit.value);
    },
    [onChangeLimit],
  );

  const renderHead = useCallback(
    (title: string, key: TProductSortField): JSX.Element => (
      <HeadCell title={title} columnKey={key} onSort={onSort} />
    ),
    [onSort],
  );

  const renderNameUser = useCallback(
    ({ name }: TProduct): JSX.Element => <NameCell name={name} />,
    [],
  );

  const renderGallery = useCallback(({ imageURLs, name }: TProduct) => {
    const imageURL = imageURLs[0];

    return <GalleryCell imageURL={imageURL} name={name} />;
  }, []);

  const renderPrice = useCallback(
    ({ amount }: TProduct) => <PriceCell price={amount} />,
    [],
  );

  const renderQuantity = useCallback(
    ({ stock }: TProduct) => <QuantityCell quantity={stock} />,
    [],
  );

  const renderProductStatus = useCallback(
    ({ productStatus }: TProduct): JSX.Element => (
      <StatusCell
        variant={STATUS_LABEL[`${productStatus}`]}
        text={productStatus}
      />
    ),
    [],
  );

  const renderActionIcon = useCallback(
    (data: TProductResponse) => (
      <ActionCell
        product={data}
        key={`${data._id}-action`}
        isOpenModal={true}
        titleDelete="Delete Product"
        itemName={data.name}
        onUpdateProduct={onSubmitProductForm}
        onDeleteProduct={onDelete}
      />
    ),
    [onDelete, onSubmitProductForm],
  );

  const columns = useMemo(
    () =>
      COLUMNS_PRODUCTS(
        renderHead,
        renderNameUser,
        renderGallery,
        renderPrice,
        renderProductStatus,
        renderQuantity,
        renderActionIcon,
      ),
    [
      renderHead,
      renderNameUser,
      renderGallery,
      renderPrice,
      renderQuantity,
      renderProductStatus,
      renderActionIcon,
    ],
  );

  return (
    <Indicator isOpen={isLoading}>
      <Flex flexDirection={{ base: 'column', lg: 'row' }}>
        <SearchBar
          placeholder="Search by name"
          filterOptions={FILTER_PRODUCT}
          searchValue={searchValue}
          onSearch={handleDebounceSearch}
          onFilter={setFilter}
        />
        <Button
          w={{ base: 'none', lg: 200 }}
          type="button"
          role="button"
          aria-label="Add User"
          colorScheme="primary"
          bg="primary.500"
          textTransform="capitalize"
          onClick={onToggleAddModal}
          marginLeft={{ base: 'initial', lg: '20px' }}
          data-testid="button-add"
        >
          Add Product
        </Button>
      </Flex>
      <Fetching quality={15} isLoading={isFetching}>
        <Box mt={5}>
          <Table
            columns={columns as unknown as THeaderTable[]}
            dataSource={formatProductResponse(productsMemorized)}
          />
        </Box>
      </Fetching>
      <Pagination
        pageSize={limit}
        currentPage={currentPage}
        isDisabledPrev={isDisablePrev}
        isDisableNext={isDisableNext}
        arrOfCurrButtons={pageArray}
        onLimitChange={handleChangeLimit}
        onPageChange={handlePageChange}
        onClickPage={onChangePage}
      />

      {isOpenAddModal && (
        <Modal
          isOpen={isOpenAddModal}
          onClose={onToggleAddModal}
          title="Add Product"
          body={
            <ProductForm
              onCloseModal={onToggleAddModal}
              onSubmit={onSubmitProductForm}
            />
          }
          haveCloseButton
        />
      )}
    </Indicator>
  );
};

const ProductionsTableMemorized = memo(ProductsTable);

export default ProductionsTableMemorized;
