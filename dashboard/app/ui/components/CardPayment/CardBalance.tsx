// Libs
import { ReactElement, memo } from 'react';
import { Center, Flex, IconButton, Text } from '@chakra-ui/react';

// Components
import { Eye, EyeSlash } from '@/ui/components';

// Constants
import { IMAGES } from '@/lib/constants';

// HOCs
import { withBalance } from '@/lib/hocs';

// Utils
import { formatDecimalNumber } from '@/lib/utils';

type TBalanceStatus = {
  balance: string;
  iconBalance: ReactElement;
};

export type TCardProps = {
  balance: number;
  isShowBalance: boolean;
  onToggleShowBalance: () => void;
};

const CardBalance = ({
  balance,
  isShowBalance,
  onToggleShowBalance,
}: TCardProps) => {
  const { iconBalance, balance: balanceStatus }: TBalanceStatus = {
    iconBalance: isShowBalance ? <EyeSlash /> : <Eye />,
    balance: isShowBalance ? `$${formatDecimalNumber(balance)}` : '******',
  };

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
            onClick={onToggleShowBalance}
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

const CardBalanceMemorized = memo(withBalance(CardBalance));

export default CardBalanceMemorized;
