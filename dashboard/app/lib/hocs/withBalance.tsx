// Libs
import { ReactNode } from 'react';
import { useDisclosure } from '@chakra-ui/react';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import { useWallet } from '@/lib/hooks';

// Types
import { TWithBalance } from '@/lib/interfaces';

export const withBalance = (
  WrappedComponent: (props: TWithBalance) => ReactNode,
) => {
  const BalanceWrapper = () => {
    const { isOpen: isShowBalance, onToggle: onToggleShowBalance } =
      useDisclosure();

    // Stores
    const user = authStore((state) => state.user);

    const { id: userId = '' } = user || {};

    // My Wallet
    const { currentWalletMoney } = useWallet(userId);

    const { balance = 0 } = currentWalletMoney || {};

    return (
      <WrappedComponent
        balance={balance}
        isShowBalance={isShowBalance}
        onConfirmPinCodeSuccess={onToggleShowBalance}
        onToggleShowBalance={onToggleShowBalance}
      />
    );
  };

  return BalanceWrapper;
};
