// Libs
import { ReactNode, useCallback } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import { useAuth, usePinCode } from '@/lib/hooks';

// Constants
import { ERROR_MESSAGES, STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Utils
import { customToast } from '@/lib/utils';

// Types
import {
  PinCodeWrapperProps,
  TPinCodeForm,
  TWithPinCode,
} from '@/lib/interfaces';

// Components
import { PinCodeModal } from '@/ui/components';

export const withPinCode = <T,>(
  WrappedComponent: (props: TWithPinCode<T>) => ReactNode,
) => {
  const PinCodeWrapper = ({
    onConfirmPinCodeSuccess,
    ...props
  }: PinCodeWrapperProps<T>) => {
    const toast = useToast();
    const { isOpen: isPinCodeModalOpen, onToggle: onTogglePinCodeModal } =
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

    const {
      control: controlPinCode,
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

    const handleConfirmPinCodeSuccess = useCallback(() => {
      onTogglePinCodeModal();
      resetPinCodeForm();

      toast(
        customToast(
          SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title,
          SUCCESS_MESSAGES.CONFIRM_PIN_CODE.description,
          STATUS.SUCCESS,
        ),
      );

      onConfirmPinCodeSuccess();
    }, [
      onConfirmPinCodeSuccess,
      onTogglePinCodeModal,
      resetPinCodeForm,
      toast,
    ]);

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
          onError: handleSetNewPinCodeError,
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

    return (
      <>
        <WrappedComponent
          onTogglePinCodeModal={onTogglePinCodeModal}
          {...(props as T)}
        />
        {isPinCodeModalOpen && (
          <PinCodeModal
            title={
              pinCode
                ? 'Please enter your PIN code'
                : 'Please set the PIN code to your account'
            }
            control={controlPinCode}
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

  return PinCodeWrapper;
};
