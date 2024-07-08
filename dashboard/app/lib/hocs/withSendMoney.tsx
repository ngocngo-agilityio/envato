// Libs
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import {
  useAuth,
  //  useGetUserDetails,
  useMoney,
} from '@/lib/hooks';

// Services
import { UsersResponse, getUserList } from '@/lib/services';

// Constants
import { ERROR_MESSAGES, STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Utils
import { customToast, removeAmountFormat } from '@/lib/utils';

// Types
import { TTransfer, TWithSendMoney } from '@/lib/interfaces';

export const withSendMoney = (
  WrappedComponent: (props: TWithSendMoney) => ReactNode,
) => {
  const SendMoneyWrapper = async () => {
    const [userList, setUserList] = useState<UsersResponse>([]);
    const toast = useToast();

    // Stores
    const user = authStore((state) => state.user);

    // Auth
    const { setUser } = useAuth();

    // Transfer
    const { sendMoneyToUserWallet, isSendMoneySubmitting } = useMoney();

    const { id: userId = '', bonusTimes = 0 } = user || {};

    // Users
    // const { filterDataUser: userList = [] } = useGetUserDetails(userId);

    const {
      control: controlSendMoney,
      handleSubmit: submitSendMoney,
      formState: { dirtyFields: sendMoneyDirtyFields },
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

    const handleSendMoneySuccess = useCallback(() => {
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
    }, [bonusTimes, setUser, toast, user]);

    const handleSendMoneyError = useCallback(() => {
      toast(
        customToast(
          ERROR_MESSAGES.SEND_MONEY.title,
          ERROR_MESSAGES.SEND_MONEY.description,
          STATUS.ERROR,
        ),
      );
    }, [toast]);

    const handleSubmitSendMoney: SubmitHandler<TTransfer> = useCallback(
      (data) => {
        const submitData = {
          ...data,
          userId,
          memberId: getMemberId(data.memberId),
          amount: removeAmountFormat(data.amount),
        };

        sendMoneyToUserWallet(submitData, {
          onSuccess: handleSendMoneySuccess,
          onError: handleSendMoneyError,
        });

        resetSendMoney();
      },
      [
        getMemberId,
        handleSendMoneyError,
        handleSendMoneySuccess,
        resetSendMoney,
        sendMoneyToUserWallet,
        userId,
      ],
    );

    const handleConfirmPinCodeSuccess = useCallback(() => {
      submitSendMoney(handleSubmitSendMoney)();
    }, [handleSubmitSendMoney, submitSendMoney]);

    console.log('userList', userList);

    const fetchUserList = useCallback(async () => {
      const { data: userList } = await getUserList(userId);

      setUserList(userList);
    }, [userId]);

    useEffect(() => {
      fetchUserList();
    }, [fetchUserList]);

    return (
      <WrappedComponent
        control={controlSendMoney}
        dirtyFields={sendMoneyDirtyFields}
        userList={userList}
        isSendMoneySubmitting={isSendMoneySubmitting}
        onSubmitSendMoneyHandler={submitSendMoney}
        onConfirmPinCodeSuccess={handleConfirmPinCodeSuccess}
      />
    );
  };

  return SendMoneyWrapper;
};
