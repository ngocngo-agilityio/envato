// Libs
import { ReactNode, useCallback } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import { useAuth, usePinCode, useWallet } from '@/lib/hooks';

// Constants
import { ERROR_MESSAGES, STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Utils
import { customToast } from '@/lib/utils';

// Types
import { TPinCodeForm } from '@/lib/interfaces';

// Components
import PinCodeModal from '@/ui/components/PinCodeModal';

export type TWithBalance<T> = {
  isShowBalance: boolean;
  onToggleShowBalance: () => void;
  balance: number;
} & T;

const withBalance = <T,>(
  WrappedComponent: (props: TWithBalance<T>) => ReactNode,
) => {
  const BalanceWrapper = (props: T) => {
    const toast = useToast();
    const { isOpen: isPinCodeModalOpen, onToggle: onTogglePinCodeModal } =
      useDisclosure();
    const { isOpen: isShowBalance, onToggle: onToggleShowBalance } =
      useDisclosure();

    // Stores
    const user = authStore((state) => state.user);

    // Auth
    const { setUser } = useAuth();

    // Pin code
    const {
      isSetNewPinCode: isLoadingSetNewPinCode,
      isConfirmPinCode: isLoadingConfirmPinCode,
      setNewPinCode,
      confirmPinCode,
    } = usePinCode();

    const { pinCode = '', id: userId = '' } = user || {};

    // My Wallet
    const { currentWalletMoney } = useWallet(userId);

    const { balance = 0 } = currentWalletMoney || {};

    const {
      control,
      handleSubmit: submitPinCode,
      formState: { isValid: isPinCodeValid },
      reset: resetPinCodeForm,
    } = useForm<TPinCodeForm>({
      defaultValues: {
        pinCode: '',
      },
      mode: 'onSubmit',
      reValidateMode: 'onSubmit',
    });

    const handleSetNewPinCodeSuccess = useCallback(
      (pinCode: string) => {
        user && setUser({ user: { ...user, pinCode } });
        onTogglePinCodeModal();
        resetPinCodeForm();

        toast(
          customToast(
            SUCCESS_MESSAGES.SET_PIN_CODE.title,
            SUCCESS_MESSAGES.SET_PIN_CODE.description,
            STATUS.SUCCESS,
          ),
        );
      },
      [onTogglePinCodeModal, resetPinCodeForm, setUser, toast, user],
    );

    const handleSetNewPinCodeError = useCallback(() => {
      toast(
        customToast(
          ERROR_MESSAGES.SET_PIN_CODE.title,
          ERROR_MESSAGES.SET_PIN_CODE.description,
          STATUS.ERROR,
        ),
      );

      resetPinCodeForm();
    }, [resetPinCodeForm, toast]);

    const handleConfirmPinCodeSuccess = useCallback(async () => {
      onTogglePinCodeModal();
      onToggleShowBalance();
      resetPinCodeForm();

      toast(
        customToast(
          SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title,
          SUCCESS_MESSAGES.CONFIRM_PIN_CODE.description,
          STATUS.SUCCESS,
        ),
      );
    }, [onTogglePinCodeModal, onToggleShowBalance, resetPinCodeForm, toast]);

    const handleConfirmPinCodeError = useCallback(() => {
      toast(
        customToast(
          ERROR_MESSAGES.CONFIRM_PIN_CODE.title,
          ERROR_MESSAGES.CONFIRM_PIN_CODE.description,
          STATUS.ERROR,
        ),
      );

      resetPinCodeForm();
    }, [resetPinCodeForm, toast]);

    const handleSubmitPinCode = useCallback(
      (data: TPinCodeForm) => {
        const payload = {
          ...data,
          userId,
        };

        if (pinCode) {
          confirmPinCode(payload, {
            onSuccess: handleConfirmPinCodeSuccess,
            onError: handleConfirmPinCodeError,
          });

          return;
        }

        setNewPinCode(payload, {
          onSuccess: () => handleSetNewPinCodeSuccess(pinCode),
          onError: () => handleSetNewPinCodeError(),
        });
      },
      [
        confirmPinCode,
        handleConfirmPinCodeError,
        handleConfirmPinCodeSuccess,
        handleSetNewPinCodeError,
        handleSetNewPinCodeSuccess,
        pinCode,
        setNewPinCode,
        userId,
      ],
    );

    const handleClosePinCodeModal = useCallback(() => {
      onTogglePinCodeModal();
      resetPinCodeForm();
    }, [onTogglePinCodeModal, resetPinCodeForm]);

    const handleToggleShowBalance = useCallback(() => {
      if (isShowBalance) {
        onToggleShowBalance();

        return;
      }

      // Open Pin Code modal
      onTogglePinCodeModal();
    }, [isShowBalance, onTogglePinCodeModal, onToggleShowBalance]);

    return (
      <>
        <WrappedComponent
          balance={balance}
          isShowBalance={isShowBalance}
          onToggleShowBalance={handleToggleShowBalance}
          {...props}
        />
        {isPinCodeModalOpen && (
          <PinCodeModal
            title={
              pinCode
                ? 'Please enter your PIN code'
                : 'Please set the PIN code to your account'
            }
            control={control}
            isOpen={true}
            isDisabled={
              !isPinCodeValid ||
              isLoadingSetNewPinCode ||
              isLoadingConfirmPinCode
            }
            isLoading={isLoadingSetNewPinCode || isLoadingConfirmPinCode}
            onclose={handleClosePinCodeModal}
            onSubmit={submitPinCode(handleSubmitPinCode)}
          />
        )}
      </>
    );
  };

  return BalanceWrapper;
};

export default withBalance;
