// Libs
import { ReactNode } from 'react';
import { useDisclosure } from '@chakra-ui/react';

// Types
import { TWithBalance } from '@/lib/interfaces';

interface BalanceForCalendarWrapperProps {
  balance: number;
}

export const withBalanceForCalendar = (
  WrappedComponent: (props: TWithBalance) => ReactNode,
) => {
  const BalanceForCalendarWrapper = ({
    balance,
  }: BalanceForCalendarWrapperProps) => {
    const { isOpen: isShowBalance, onToggle: onToggleShowBalance } =
      useDisclosure();

    return (
      <WrappedComponent
        balance={balance}
        isShowBalance={isShowBalance}
        onConfirmPinCodeSuccess={onToggleShowBalance}
        onToggleShowBalance={onToggleShowBalance}
      />
    );
  };

  return BalanceForCalendarWrapper;
};
