'use client';

import { memo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Control, UseFormHandleSubmit } from 'react-hook-form';

// Types
import { TAddMoneyForm } from '@/lib/interfaces';

// HOCs
import { withAddMoney } from '@/lib/hocs';

// Components
import { AddMoneyInput } from './AddMoneyInput';

interface TotalBalanceProps {
  control: Control<TAddMoneyForm>;
  isDirty: boolean;
  isSubmitting: boolean;
  onSubmitHandler: UseFormHandleSubmit<TAddMoneyForm>;
  onSubmit: () => void;
}

const TotalBalance = ({
  control,
  isDirty,
  isSubmitting,
  onSubmitHandler,
  onSubmit,
}: TotalBalanceProps): JSX.Element => (
  <Box w="full" bg="background.body.quaternary" px={8} py={7} borderRadius="lg">
    <form onSubmit={onSubmitHandler(onSubmit)}>
      <AddMoneyInput control={control} />
      <Button
        aria-label="btn-add-money"
        mt={14}
        colorScheme="primary"
        bg="primary.300"
        fontWeight="bold"
        type="submit"
        isDisabled={!isDirty || isSubmitting}
        isLoading={isSubmitting}
      >
        Add Money
      </Button>
    </form>
  </Box>
);

const TotalBalanceMemorized = memo(withAddMoney(TotalBalance));

export default TotalBalanceMemorized;
