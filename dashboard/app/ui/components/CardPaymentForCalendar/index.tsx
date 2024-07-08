'use client';

import { memo } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Control, UseFormHandleSubmit } from 'react-hook-form';

// Components
import CardBalanceForCalendar from './CardBalanceForCalendar';
import UserSelector from '../CardPayment/UserSelector';
import EnterMoney from '../CardPayment/EnterMoney';

// Utils
import { isEnableSubmitButton } from '@/lib/utils';

// HOCs
import { withPinCode, withSendMoneyForCalendar } from '@/lib/hocs';

// Types
import {
  TTransfer,
  TTransferDirtyFields,
  TUserDetail,
  TWithPinCode,
  TWithSendMoney,
} from '@/lib/interfaces';

const REQUIRE_FIELDS = ['amount', 'memberId'];

interface TCardPaymentProps {
  control: Control<TTransfer>;
  dirtyFields: TTransferDirtyFields;
  userList: Array<
    Omit<TUserDetail, 'id'> & {
      _id: string;
    }
  >;
  isSendMoneySubmitting: boolean;
  onSubmitSendMoneyHandler: UseFormHandleSubmit<TTransfer>;
  balance: number;
}

export type TCardPaymentWithPinCode = TWithSendMoney &
  TWithPinCode<TCardPaymentProps>;

const CardPaymentForCalendar = ({
  control,
  dirtyFields,
  userList,
  isSendMoneySubmitting,
  balance,
  onSubmitSendMoneyHandler,
  onTogglePinCodeModal,
}: TCardPaymentWithPinCode): JSX.Element => {
  const dirtyItems = Object.keys(dirtyFields).filter(
    (key) => dirtyFields[key as keyof TTransfer],
  );
  const shouldEnable = isEnableSubmitButton(REQUIRE_FIELDS, dirtyItems);

  return (
    <Box
      p={4}
      w="full"
      bg="background.body.quaternary"
      py={{ base: 4, md: 5 }}
      px={{ base: 4, md: 10 }}
      borderRadius="lg"
    >
      <Heading
        as="h3"
        fontWeight="bold"
        color="text.primary"
        fontSize="lg"
        mb={3}
        textTransform="capitalize"
      >
        my wallet
      </Heading>

      <CardBalanceForCalendar balance={balance} />

      <Box
        as="form"
        mt={4}
        onSubmit={onSubmitSendMoneyHandler(onTogglePinCodeModal)}
      >
        <UserSelector control={control} listUser={userList} />
        <EnterMoney
          isDisabled={!shouldEnable || isSendMoneySubmitting}
          isLoading={isSendMoneySubmitting}
          control={control}
        />
      </Box>
    </Box>
  );
};

const CardPaymentMemorized = memo(
  withSendMoneyForCalendar(withPinCode(CardPaymentForCalendar)),
);

export default CardPaymentMemorized;
