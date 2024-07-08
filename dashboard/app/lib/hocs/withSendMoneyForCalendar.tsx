// Libs
import { ReactNode, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';

// Stores
import { authStore } from '@/lib/stores';

// Actions
import { sendMoney } from '@/lib/actions';

// Hooks
import { useAuth } from '@/lib/hooks';

// Constants
import { STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Utils
import { customToast, removeAmountFormat } from '@/lib/utils';

// Types
import {
  TTransfer,
  TUserDetail,
  TWithSendMoneyForCalendar,
} from '@/lib/interfaces';

interface SendMoneyForCalendarWrapperProps {
  userList: Array<
    Omit<TUserDetail, 'id'> & {
      _id: string;
    }
  >;
  balance: number;
}

export const withSendMoneyForCalendar = (
  WrappedComponent: (props: TWithSendMoneyForCalendar) => ReactNode,
) => {
  const SendMoneyForCalendarWrapper = async ({
    userList,
    balance,
  }: SendMoneyForCalendarWrapperProps) => {
    const toast = useToast();

    // Stores
    const user = authStore((state) => state.user);

    // Auth
    const { setUser } = useAuth();

    const { id: userId = '', bonusTimes = 0 } = user || {};

    const {
      control: controlSendMoney,
      handleSubmit: submitSendMoney,
      formState: { dirtyFields: sendMoneyDirtyFields, isSubmitting },
      reset: resetSendMoney,
    } = useForm<TTransfer>({
      defaultValues: {
        memberId: '',
        amount: '',
      },
    });

    const getMemberId = useCallback(
      (email: string): string =>
        userList.find(
          (user) =>
            user.email.trim().toLocaleLowerCase() ===
            email.trim().toLowerCase(),
        )?._id || '',
      [userList],
    );

    const handleSubmitSendMoney: SubmitHandler<TTransfer> = useCallback(
      async (data) => {
        const submitData = {
          ...data,
          userId,
          memberId: getMemberId(data.memberId),
          amount: removeAmountFormat(data.amount),
        };

        const res = await sendMoney(submitData);

        const { error } = res || {};

        if (error) {
          toast(customToast(error.title, error.description, STATUS.ERROR));
          resetSendMoney();

          return;
        }

        toast(
          customToast(
            SUCCESS_MESSAGES.SEND_MONEY.title,
            SUCCESS_MESSAGES.SEND_MONEY.description,
            STATUS.SUCCESS,
          ),
        );

        bonusTimes &&
          user &&
          setUser({
            user: {
              ...user,
              bonusTimes: bonusTimes - 1,
            },
          });
        resetSendMoney();
      },
      [bonusTimes, getMemberId, resetSendMoney, setUser, toast, user, userId],
    );

    const handleConfirmPinCodeSuccess = useCallback(() => {
      submitSendMoney(handleSubmitSendMoney)();
    }, [handleSubmitSendMoney, submitSendMoney]);

    return (
      <WrappedComponent
        balance={balance}
        control={controlSendMoney}
        dirtyFields={sendMoneyDirtyFields}
        userList={userList}
        isSendMoneySubmitting={isSubmitting}
        onSubmitSendMoneyHandler={submitSendMoney}
        onConfirmPinCodeSuccess={handleConfirmPinCodeSuccess}
      />
    );
  };

  return SendMoneyForCalendarWrapper;
};
