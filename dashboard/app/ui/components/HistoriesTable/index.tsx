'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { Box, Td, Text, Th } from '@chakra-ui/react';

// Components
import {
  Table,
  Pagination,
  CustomerNameCell,
  HeadCell,
  SearchBar,
  StatusCell,
  Fetching,
} from '@/ui/components';

// Constants
import {
  COLUMNS_HISTORY,
  STATUS_LABEL,
  MONTHS_OPTIONS,
  PAGE_SIZE,
} from '@/lib/constants';
import { TYPE } from '@/lib/constants/notification';

// Hooks
import {
  TSortField,
  useDebounce,
  usePagination,
  useSearch,
  useTransactions,
} from '@/lib/hooks';

// Utils
import { formatTransactionResponse } from '@/lib/utils';

// Types
import { TDataSource, THeaderTable, TTransaction } from '@/lib/interfaces';

const HistoriesTable = () => {
  const { get, setSearchParam: setSearchTransaction } = useSearch();
  const [filter, setFilter] = useState<string>('');

  const {
    dataHistory,
    isLoading: isLoadingTransactions,
    isError: isTransactionsError,
    sortBy,
  } = useTransactions({
    name: get('keyword')?.toLowerCase() || '',
  });

  const transactionsMemorized = useMemo(
    () =>
      dataHistory.filter(({ createdAt }) => {
        const month: string = new Date(createdAt)
          .toLocaleString('default', { month: 'short' })
          .toLowerCase();

        return month.includes(filter.trim());
      }),
    [filter, dataHistory],
  );

  const {
    data,
    filterData,
    arrOfCurrButtons,
    isDisabledPrev,
    isDisableNext,
    resetPage,
    handleChangeLimit,
    handlePageChange,
    handlePageClick,
  } = usePagination(transactionsMemorized);

  const { limit = PAGE_SIZE, currentPage = 1 } = data || {};

  // Update search params when end time debounce
  const handleDebounceSearch = useDebounce((value: string) => {
    resetPage();
    setSearchTransaction('keyword', value);
  }, []);

  const renderHead = useCallback(
    (title: string, key: string): JSX.Element => {
      const handleClick = () => {
        sortBy && sortBy(key as TSortField);
      };

      return title ? (
        <HeadCell key={title} title={title} onClick={handleClick} />
      ) : (
        <Th w={50} maxW={50} />
      );
    },
    [sortBy],
  );

  const renderNameUser = useCallback(
    ({ id, image, name }: TDataSource): JSX.Element => (
      <CustomerNameCell id={id} key={id} image={image} name={name} />
    ),
    [],
  );

  type TStatus = keyof typeof STATUS_LABEL;

  const renderPaymentStatus = useCallback(
    ({ paymentStatus }: TDataSource): JSX.Element => (
      <StatusCell
        variant={STATUS_LABEL[`${paymentStatus}` as TStatus]}
        text={paymentStatus as string}
      />
    ),
    [],
  );

  const renderTransactionStatus = useCallback(
    ({ transactionStatus }: TDataSource): JSX.Element => (
      <StatusCell
        variant={STATUS_LABEL[`${transactionStatus}` as TStatus]}
        text={transactionStatus as string}
      />
    ),
    [],
  );

  const renderSpent = useCallback(({ amount, type }: TTransaction) => {
    const isSendMoney = type === TYPE.SEND_MONEY;

    return (
      <Td
        py={5}
        pr={5}
        pl={0}
        fontSize="md"
        color="text.primary"
        fontWeight="semibold"
        textAlign="left"
        w={{ base: 150, md: 20 }}
      >
        <Text
          fontSize="md"
          fontWeight="semibold"
          whiteSpace="break-spaces"
          color={isSendMoney ? 'red.600' : 'text.currencyColor'}
          noOfLines={1}
          w={{ base: 100, md: 150, '3xl': 200, '5xl': 110, '7xl': 200 }}
          flex={1}
        >
          {amount}
        </Text>
      </Td>
    );
  }, []);

  const columns = useMemo(
    () =>
      COLUMNS_HISTORY(
        renderHead,
        renderNameUser,
        renderPaymentStatus,
        renderTransactionStatus,
        renderSpent,
      ),
    [
      renderHead,
      renderNameUser,
      renderPaymentStatus,
      renderSpent,
      renderTransactionStatus,
    ],
  );

  return (
    <>
      <SearchBar
        filterOptions={MONTHS_OPTIONS}
        searchValue={get('keyword')?.toLowerCase() || ''}
        onSearch={handleDebounceSearch}
        onFilter={setFilter}
      />
      <Fetching
        quality={15}
        isLoading={isLoadingTransactions}
        isError={isTransactionsError}
      >
        <Box mt={5}>
          <Table
            columns={columns as THeaderTable[]}
            dataSource={formatTransactionResponse(filterData)}
          />
        </Box>
      </Fetching>
      <Pagination
        pageSize={limit}
        currentPage={currentPage}
        isDisabledPrev={isDisabledPrev}
        isDisableNext={isDisableNext}
        arrOfCurrButtons={arrOfCurrButtons}
        onLimitChange={handleChangeLimit}
        onPageChange={handlePageChange}
        onClickPage={handlePageClick}
      />
    </>
  );
};

const HistoriesTableMemorized = memo(HistoriesTable);

export default HistoriesTableMemorized;
