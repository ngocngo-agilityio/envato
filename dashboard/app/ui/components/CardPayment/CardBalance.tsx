// Libs
import { ReactElement, memo, useCallback } from 'react';
import { Center, Flex, IconButton, Text } from '@chakra-ui/react';

// Components
import { Eye, EyeSlash } from '@/ui/components';

// Constants
import { IMAGES } from '@/lib/constants';

// HOCs
import { withBalance, withPinCode } from '@/lib/hocs';

// Utils
import { formatDecimalNumber } from '@/lib/utils';

// Types
import { TWithBalance, TWithPinCode } from '@/lib/interfaces';

type TBalanceStatus = {
  balance: string;
  iconBalance: ReactElement;
};

interface TCardBalanceProps {
  balance: number;
  isShowBalance: boolean;
  onToggleShowBalance: () => void;
}

export type TCardBalanceWithPinCode = TWithBalance &
  TWithPinCode<TCardBalanceProps>;

const CardBalance = ({
  balance,
  isShowBalance,
  onTogglePinCodeModal,
  onToggleShowBalance,
}: TCardBalanceWithPinCode) => {
  const { iconBalance, balance: balanceStatus }: TBalanceStatus = {
    iconBalance: isShowBalance ? <EyeSlash /> : <Eye />,
    balance: isShowBalance ? `$${formatDecimalNumber(balance)}` : '******',
  };

  const handleToggleShowBalance = useCallback(() => {
    if (isShowBalance) {
      onToggleShowBalance();

      return;
    }

    // Open Pin Code modal
    onTogglePinCodeModal();
  }, [isShowBalance, onTogglePinCodeModal, onToggleShowBalance]);

  return (
    <Center>
      <Flex
        flexDir="column"
        bgImage={IMAGES.CARD_PAYMENT.url}
        justifyContent="flex-end"
        borderRadius="lg"
        bgPosition="center"
        bgSize={{ base: 'cover', sm: 'unset' }}
        bgRepeat="no-repeat"
        p={2}
        w={{ base: '100%', sm: 340 }}
        h={{ base: 180, sm: 200 }}
      >
        <Flex alignItems="center" gap={{ base: 1, sm: 3 }}>
          <Text variant="textSm" color="secondary.300">
            Balance
          </Text>
          <IconButton
            aria-label="eye"
            data-testid="btn-eye"
            icon={iconBalance}
            w="fit-content"
            bg="none"
            onClick={handleToggleShowBalance}
            sx={{
              _hover: {
                bg: 'none',
              },
            }}
          />
        </Flex>
        <Text
          color="common.white"
          variant="text3Xl"
          fontWeight="semibold"
          fontSize={{ base: 'md', sm: '3xl' }}
          lineHeight={{ base: 'unset', sm: 'lg' }}
        >
          {balanceStatus}
        </Text>
      </Flex>
    </Center>
  );
};

const CardBalanceMemorized = memo(withBalance(withPinCode(CardBalance)));

export default CardBalanceMemorized;
