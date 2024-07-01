'use client';

import { memo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Control, UseFormHandleSubmit } from 'react-hook-form';

// Types
import { TAddMoneyForm, TWithAddMoney, TWithPinCode } from '@/lib/interfaces';

// HOCs
import { withAddMoney, withPinCode } from '@/lib/hocs';

// Components
import { AddMoneyInput } from './AddMoneyInput';

interface TotalBalanceProps {
  control: Control<TAddMoneyForm>;
  isDirty: boolean;
  isSubmitting: boolean;
  onSubmitHandler: UseFormHandleSubmit<TAddMoneyForm>;
}

type TTotalBalanceWithPinCode = TWithAddMoney & TWithPinCode<TotalBalanceProps>;

const TotalBalance = ({
  control,
  isDirty,
  isSubmitting,
  onSubmitHandler,
  onTogglePinCodeModal,
}: TTotalBalanceWithPinCode): JSX.Element => (
  <Box w="full" bg="background.body.quaternary" px={8} py={7} borderRadius="lg">
    <form onSubmit={onSubmitHandler(onTogglePinCodeModal)}>
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

const TotalBalanceMemorized = memo(withAddMoney(withPinCode(TotalBalance)));

export default TotalBalanceMemorized;
