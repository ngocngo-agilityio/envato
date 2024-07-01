// Libs
import { ReactNode, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import { useAuth, useMoney } from '@/lib/hooks';

// Constants
import {
  DEFAULT_DISCOUNT_PERCENTAGE,
  ERROR_MESSAGES,
  STATUS,
  SUCCESS_MESSAGES,
} from '@/lib/constants';

// Utils
import { customToast, removeAmountFormat } from '@/lib/utils';

// Types
import { TAddMoneyForm, TWithAddMoney } from '@/lib/interfaces';

export const withAddMoney = (
  WrappedComponent: (props: TWithAddMoney) => ReactNode,
) => {
  const AddMoneyWrapper = () => {
    const toast = useToast();

    // Stores
    const user = authStore((state) => state.user);

    // Auth
    const { setUser } = useAuth();

    // Transfer
    const { addMoneyToUserWallet, isAddMoneySubmitting } = useMoney();

    const { id: userId = '', bonusTimes = 0 } = user || {};

    const {
      control: controlAddMoney,
      handleSubmit: submitAddMoney,
      formState: { isDirty: isDirtyAddMoney },
      reset: resetAddMoney,
    } = useForm<TAddMoneyForm>({
      defaultValues: {
        amount: '',
      },
    });

    const handleAddMoneySuccess = useCallback(() => {
      toast(
        customToast(
          SUCCESS_MESSAGES.ADD_MONEY.title,
          SUCCESS_MESSAGES.ADD_MONEY.description,
          STATUS.SUCCESS,
        ),
      );

      resetAddMoney();

      bonusTimes &&
        user &&
        setUser({
          user: {
            ...user,
            bonusTimes: bonusTimes - 1,
          },
        });
    }, [bonusTimes, resetAddMoney, setUser, toast, user]);

    const handleAddMoneyError = useCallback(() => {
      toast(
        customToast(
          ERROR_MESSAGES.ADD_MONEY.title,
          ERROR_MESSAGES.ADD_MONEY.description,
          STATUS.ERROR,
        ),
      );

      resetAddMoney();
    }, [resetAddMoney, toast]);

    const handleSubmitAddMoney: SubmitHandler<TAddMoneyForm> = useCallback(
      (data) => {
        const addMoneyAmount = removeAmountFormat(data.amount);

        const submitData = {
          userId,
          amount:
            addMoneyAmount +
            (bonusTimes ? addMoneyAmount * DEFAULT_DISCOUNT_PERCENTAGE : 0),
        };

        addMoneyToUserWallet(submitData, {
          onSuccess: handleAddMoneySuccess,
          onError: handleAddMoneyError,
        });
      },
      [
        userId,
        bonusTimes,
        addMoneyToUserWallet,
        handleAddMoneySuccess,
        handleAddMoneyError,
      ],
    );

    const handleConfirmPinCodeSuccess = useCallback(() => {
      submitAddMoney(handleSubmitAddMoney)();
    }, [handleSubmitAddMoney, submitAddMoney]);

    return (
      <WrappedComponent
        control={controlAddMoney}
        isDirty={isDirtyAddMoney}
        isSubmitting={isAddMoneySubmitting}
        onSubmitHandler={submitAddMoney}
        onConfirmPinCodeSuccess={handleConfirmPinCodeSuccess}
      />
    );
  };

  return AddMoneyWrapper;
};
