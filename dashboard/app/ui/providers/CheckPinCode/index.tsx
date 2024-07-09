'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';

//Constants
import { ERROR_MESSAGES, STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Hooks
import { useAuth, usePinCode } from '@/lib/hooks';

// Stores
import { TAuthStoreData, authStore } from '@/lib/stores';

// Utils
import { customToast } from '@/lib/utils';

// Types
import { TPinCodeForm, TUserDetail } from '@/lib/interfaces';

const Modal = dynamic(() => import('@/ui/components/common/Modal'));
const PinCode = dynamic(() => import('@/ui/components/common/PinCode'));

const CheckPinCodeProvider = () => {
  const user = authStore((state): TAuthStoreData['user'] => state.user);

  const { isOpen: isPinCodeModalOpen, onClose: onClosePinCodeModal } =
    useDisclosure({ isOpen: true });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<TPinCodeForm>({
    defaultValues: {
      pinCode: '',
    },
  });

  const { setUser } = useAuth();

  const toast = useToast();

  const { setNewPinCode, isSetNewPinCode } = usePinCode();

  const handleSetNewPinCodeSuccess = useCallback(
    (user: Partial<Omit<TUserDetail, 'password'>>, pinCode: string) => {
      setUser({ user: { ...user, pinCode } });
      onClosePinCodeModal();

      toast(
        customToast(
          SUCCESS_MESSAGES.SET_PIN_CODE.title,
          SUCCESS_MESSAGES.SET_PIN_CODE.description,
          STATUS.SUCCESS,
        ),
      );
    },
    [onClosePinCodeModal, setUser, toast],
  );

  const handleSetNewPinCodeError = useCallback(() => {
    toast(
      customToast(
        ERROR_MESSAGES.SET_PIN_CODE.title,
        ERROR_MESSAGES.SET_PIN_CODE.description,
        STATUS.ERROR,
      ),
    );
  }, [toast]);

  const onSubmitPinCode: SubmitHandler<TPinCodeForm> = useCallback(
    (data) => {
      if (user) {
        data.userId = user.id;

        setNewPinCode(data, {
          onSuccess: () => handleSetNewPinCodeSuccess(user, data.pinCode),
          onError: handleSetNewPinCodeError,
        });
      }
    },
    [handleSetNewPinCodeError, handleSetNewPinCodeSuccess, setNewPinCode, user],
  );

  const pinCodeModalBody = useMemo(
    () => (
      <PinCode
        control={control}
        isDisabled={!isValid || isSetNewPinCode}
        isLoading={isSetNewPinCode}
        onSubmit={handleSubmit(onSubmitPinCode)}
        onClose={onClosePinCodeModal}
      />
    ),
    [
      control,
      handleSubmit,
      isSetNewPinCode,
      isValid,
      onClosePinCodeModal,
      onSubmitPinCode,
    ],
  );

  return (
    isPinCodeModalOpen && (
      <Modal
        title="Please set the PIN code to your account"
        isOpen={isPinCodeModalOpen}
        onClose={onClosePinCodeModal}
        body={pinCodeModalBody}
      />
    )
  );
};

export default CheckPinCodeProvider;
