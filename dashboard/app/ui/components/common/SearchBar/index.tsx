'use client';

import { FormEventHandler, memo, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, HStack } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { CloseIcon, Search2Icon } from '@chakra-ui/icons';

// Components
import { InputField, Select, Selector } from '@/ui/components';

// Types
import { TOption } from '@/ui/components/common/Select';

export type TSearchValue = {
  search: string;
};

type TSearchProps = {
  searchValue: string;
  filterOptions: TOption[];
  placeholder?: string;
  onSearch: (value: string) => void;
  onFilter?: (value: string) => void;
};

const SearchBarComponent = ({
  searchValue,
  filterOptions,
  placeholder = 'Search by name, email, or other...',
  onSearch,
  onFilter,
}: TSearchProps): JSX.Element => {
  const renderTitleSelector = useCallback(() => <Selector />, []);

  // Form control for search
  const { control, resetField } = useForm<TSearchValue>({
    defaultValues: {
      search: searchValue,
    },
  });

  const handleSelectMonth = useCallback(
    ({ value }: TOption) => onFilter && onFilter(value),
    [onFilter],
  );

  const handleResetValue = useCallback(() => {
    onSearch('');
    resetField('search');
  }, [onSearch, resetField]);

  const handleStopSubmitForm: FormEventHandler<HTMLDivElement> = useCallback(
    (e) => e.preventDefault(),
    [],
  );

  return (
    <HStack
      flexDirection={{ base: 'column', sm: 'column', lg: 'row' }}
      as="form"
      data-testid="search-bar"
      h={{ base: 'none', lg: 14 }}
      gap={{
        base: '2',
        sm: '2',
        lg: '5',
      }}
      alignItems="stretch"
      onSubmit={handleStopSubmitForm}
      width="100%"
      marginBottom={{ base: 15, lg: 0 }}
    >
      <Box
        display={{
          base: 'flex',
          sm: 'block',
        }}
        flex={1}
        mb={{ base: 2 }}
      >
        <Controller
          control={control}
          name="search"
          render={({ field: { value, onChange } }) => (
            <InputField
              value={value}
              onChange={(value: string) => {
                onChange(value);
                onSearch(value);
              }}
              placeholder={placeholder}
              variant="secondary"
              leftIcon={<Search2Icon />}
              rightIcon={value && <CloseIcon onClick={handleResetValue} />}
              data-testid="search-transaction"
              fontSize={{ base: '12px', md: '14px' }}
            />
          )}
        />
      </Box>
      <Box
        h="100%"
        w={{
          base: '100%',
          sm: '100%',
          lg: '150px',
        }}
        borderWidth="1px"
        borderRadius="lg"
        backgroundColor="border.denary"
        borderColor="border.nonary"
      >
        <Select
          options={filterOptions}
          renderTitle={renderTitleSelector}
          onSelect={handleSelectMonth}
        />
      </Box>
    </HStack>
  );
};

const SearchBar = memo(SearchBarComponent, isEqual);

export default SearchBar;
