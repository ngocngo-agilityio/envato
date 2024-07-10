// Libs
import { ReactNode, useCallback, useTransition } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

// Stores
import { authStore } from '@/lib/stores';

// Hocs
import { confirmPinCode, setPinCode } from '@/lib/actions';

// Hooks
import { useAuth } from '@/lib/hooks';

// Constants
import { STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

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
    const [, startTransition] = useTransition();

    // Stores
    const user = authStore((state) => state.user);

    // Auth
    const { setUser } = useAuth();

    const { pinCode = '', id: userId = '' } = user || {};

    const {
      control: controlPinCode,
      handleSubmit: submitPinCode,
      formState: { isValid: isPinCodeValid, isSubmitting },
      reset: resetPinCodeForm,
    } = useForm<TPinCodeForm>({
      defaultValues: {
        pinCode: '',
      },
      mode: 'onSubmit',
      reValidateMode: 'onSubmit',
    });

    const handleConfirmPinCode = useCallback(
      async (pinCode: string, userId: string) => {
        const res = await confirmPinCode(pinCode, userId);

        const { error } = res || {};

        if (error) {
          toast(customToast(error.title, error.description, STATUS.ERROR));
          resetPinCodeForm();

          return;
        }

        startTransition(() => {
          onTogglePinCodeModal();
          resetPinCodeForm();
        });

        toast(
          customToast(
            SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title,
            SUCCESS_MESSAGES.CONFIRM_PIN_CODE.description,
            STATUS.SUCCESS,
          ),
        );

        onConfirmPinCodeSuccess();
      },
      [onConfirmPinCodeSuccess, onTogglePinCodeModal, resetPinCodeForm, toast],
    );

    const handleSetPinCode = useCallback(
      async (pinCode: string, userId: string) => {
        const res = await setPinCode(pinCode, userId);

        const { error } = res || {};

        if (error) {
          toast(customToast(error.title, error.description, STATUS.ERROR));
          startTransition(() => resetPinCodeForm());

          return;
        }

        startTransition(() => {
          onTogglePinCodeModal();
          setUser({ user: { ...user, pinCode } });
          resetPinCodeForm();
        });

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

    const handleSubmitPinCode = useCallback(
      (data: TPinCodeForm) => {
        if (pinCode) {
          return handleConfirmPinCode(data.pinCode, userId);
        }

        return handleSetPinCode(data.pinCode, userId);
      },
      [handleConfirmPinCode, handleSetPinCode, pinCode, userId],
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
            isDisabled={!isPinCodeValid || isSubmitting}
            isLoading={isSubmitting}
            onclose={handleClosePinCodeModal}
            onSubmit={submitPinCode(handleSubmitPinCode)}
          />
        )}
      </>
    );
  };

  return PinCodeWrapper;
};
