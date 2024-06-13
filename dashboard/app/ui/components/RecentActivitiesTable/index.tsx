'use client';

import { Box, Flex, Td, Text, Th, Tooltip } from '@chakra-ui/react';
import { memo, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

// Components
import {
  Table,
  HeadCell,
  SearchBar,
  Fetching,
  Pagination,
  Indicator,
} from '@/ui/components';
import { TOption } from '../common/Select';

// Constants
import {
  ACTIVITY_OPTIONS,
  COLUMNS_RECENT_ACTIVITIES,
  PREV,
} from '@/lib/constants';

// hooks
import {
  TActivitiesSortField,
  useDebounce,
  useRecentActivities,
  useSearch,
} from '@/lib/hooks';

// Utils
import {
  formatRecentActivitiesResponse,
  formatUppercaseFirstLetter,
} from '@/lib/utils';

// Interfaces
import { TDataSource, THeaderTable, TRecentActivities } from '@/lib/interfaces';

const RecentActivitiesTable = () => {
  const { get, setSearchParam: setSearchTransaction } = useSearch();
  const [filter, setFilter] = useState<string>('');

  const {
    activities,
    limit,
    isLoading: isLoadingActivities,
    isError: isActivitiesError,
    pageArray,
    currentPage,
    isDisableNext,
    isDisablePrev,
    sortBy,
    setCurrentPage,
    setLimit,
    resetPage,
  } = useRecentActivities({
    actionName: get('keyword')?.toLowerCase() || '',
  });

  const activityMemorized = useMemo(
    () =>
      activities.filter(
        ({ actionName }) => actionName?.trim().includes(filter),
      ),
    [activities, filter],
  );

  const handleDebounceSearch = useDebounce((value: string) => {
    resetPage();
    setSearchTransaction('keyword', value);
  }, []);

  const handleClickPage = useCallback(
    (value: number) => setCurrentPage(value),
    [setCurrentPage],
  );

  const handlePageChange = useCallback(
    (direction: string) =>
      setCurrentPage(direction === PREV ? currentPage - 1 : currentPage + 1),
    [currentPage, setCurrentPage],
  );

  const handleChangeLimit = useCallback(
    (limit: TOption) => {
      setLimit(+limit.value);
      resetPage();
    },
    [resetPage, setLimit],
  );

  const renderHead = useCallback(
    (title: string, key: string): JSX.Element => {
      const handleClick = () => {
        sortBy && sortBy(key as TActivitiesSortField);
      };

      return title ? (
        <HeadCell key={title} title={title} onClick={handleClick} />
      ) : (
        <Th w={50} maxW={50} />
      );
    },
    [sortBy],
  );

  const renderIdAction = useCallback(
    ({ _id }: TDataSource): JSX.Element => (
      <Td
        py={5}
        pr={5}
        pl={0}
        fontSize="md"
        color="text.primary"
        fontWeight="semibold"
        textAlign="left"
        w={{ base: 150, md: 250, '6xl': 300 }}
      >
        <Flex alignItems="center" gap="10px">
          <Tooltip
            minW="max-content"
            placement="bottom-start"
            label={_id as string}
          >
            <Text
              display="block"
              fontSize={{ base: '12px', md: '16px' }}
              fontWeight="semibold"
              wordBreak="break-all"
              textOverflow="ellipsis"
              overflow="hidden"
              pr={10}
              flex={1}
              w={{ base: 150, md: 250, '6xl': 300 }}
            >
              {formatUppercaseFirstLetter(`${_id}`)}
            </Text>
          </Tooltip>
        </Flex>
      </Td>
    ),
    [],
  );

  const renderNameUser = useCallback(
    ({ actionName }: TDataSource): JSX.Element => (
      <Td
        py={5}
        pr={5}
        pl={0}
        fontSize="md"
        color="text.primary"
        fontWeight="semibold"
        textAlign="left"
        w={{ base: 150, md: 250, '6xl': 300 }}
      >
        <Flex alignItems="center" gap="10px">
          <Tooltip
            minW="max-content"
            placement="bottom-start"
            label={actionName as string}
          >
            <Text
              display="block"
              fontSize="md"
              fontWeight="semibold"
              wordBreak="break-all"
              textOverflow="ellipsis"
              overflow="hidden"
              pr={10}
              flex={1}
              w={{ base: 150, md: 250, '6xl': 300 }}
            >
              {formatUppercaseFirstLetter(`${actionName}`)}
            </Text>
          </Tooltip>
        </Flex>
      </Td>
    ),
    [],
  );

  const renderEmail = useCallback(
    ({ email }: TRecentActivities) => (
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
          as={Link}
          href={`mailto:${email}`}
          fontSize="md"
          fontWeight="semibold"
          whiteSpace="break-spaces"
          noOfLines={1}
          w={{ base: 100, md: 220, '3xl': 200, '5xl': 200, '7xl': 350 }}
          flex={1}
        >
          {email}
        </Text>
      </Td>
    ),
    [],
  );

  const columns = useMemo(
    () =>
      COLUMNS_RECENT_ACTIVITIES(
        renderHead,
        renderIdAction,
        renderNameUser,
        renderEmail,
      ),
    [renderHead, renderIdAction, renderNameUser, renderEmail],
  );

  return (
    <Indicator>
      <Flex flexDirection={{ base: 'column', lg: 'row' }}>
        <SearchBar
          placeholder="Search by name or email"
          filterOptions={ACTIVITY_OPTIONS}
          searchValue={get('keyword')?.toLowerCase() || ''}
          onSearch={handleDebounceSearch}
          onFilter={setFilter}
        />
      </Flex>
      <Fetching
        quality={15}
        isLoading={isLoadingActivities}
        isError={isActivitiesError}
      >
        <Box mt={5}>
          <Table
            columns={columns as unknown as THeaderTable[]}
            dataSource={formatRecentActivitiesResponse(activityMemorized)}
          />
        </Box>
      </Fetching>
      <Pagination
        pageSize={limit}
        currentPage={currentPage}
        isDisabledPrev={isDisablePrev}
        isDisableNext={isDisableNext}
        arrOfCurrButtons={pageArray}
        onPageChange={handlePageChange}
        onClickPage={handleClickPage}
        onLimitChange={handleChangeLimit}
      />
    </Indicator>
  );
};

const RecentActivitiesTableMemorized = memo(RecentActivitiesTable);

export default RecentActivitiesTableMemorized;
