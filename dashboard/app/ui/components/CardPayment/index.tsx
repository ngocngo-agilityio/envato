'use client';

import { memo, useCallback } from 'react';
import { Box, Heading, useDisclosure, useToast } from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { AxiosError } from 'axios';

// Components
import { PinCodeModal } from '@/ui/components';
import CardBalance from './CardBalance';
import UserSelector from './UserSelector';
import EnterMoney from './EnterMoney';

// Constants
import { ERROR_MESSAGES, STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Hooks
import {
  useAuth,
  useForm,
  useGetUserDetails,
  useMoney,
  usePinCode,
  useWallet,
} from '@/lib/hooks';

// Stores
import { authStore } from '@/lib/stores';

// Utils
import {
  customToast,
  getErrorMessageFromAxiosError,
  removeAmountFormat,
  isEnableSubmitButton,
} from '@/lib/utils';

// Types
import {
  TPinCodeForm,
  TSendMoney,
  TMoneyResponse,
  TUserDetail,
} from '@/lib/interfaces';

export type TTransfer = {
  amount: string;
  memberId: string;
  userId: string;
};

interface CardPaymentProps {
  userPinCode: string;
  isLoadingPinCode: boolean;
  onSubmitPinCodeForm: (pinCode: string, callback?: () => void) => void;
  isPinCodeModalOpen: boolean;
  onTogglePinCodeModal: () => void;
  isShowBalance: boolean;
  onToggleShowBalance: () => void;
}

const REQUIRE_FIELDS = ['amount', 'memberId'];

const CardPayment = ({
  userPinCode,
  isLoadingPinCode,
  isPinCodeModalOpen,
  onTogglePinCodeModal,
  isShowBalance,
  onToggleShowBalance,
  onSubmitPinCodeForm,
}: CardPaymentProps): JSX.Element => {
  const user = authStore((state) => state.user);

  const { setUser } = useAuth();

  const toast = useToast();

  const {
    control,
    handleSubmit: handleSubmitSendMoney,
    formState: { isSubmitting, dirtyFields },
    reset: resetSendMoneyForm,
  } = useForm<TTransfer>({
    defaultValues: {
      memberId: '',
      amount: '',
      userId: user?.id,
    },
  });

  const dirtyItems = Object.keys(dirtyFields).filter(
    (key) => dirtyFields[key as keyof TTransfer],
  );
  const shouldEnable = isEnableSubmitButton(REQUIRE_FIELDS, dirtyItems);

  const { currentWalletMoney } = useWallet(user?.id);

  const { filterDataUser } = useGetUserDetails(user?.id || '');

  const {
    isOpen: isSetPinCodeModalOpen,
    onClose: onCloseSetPinCodeModal,
    onOpen: onOpenSetPinCodeModal,
  } = useDisclosure();

  const {
    isOpen: isConfirmPinCodeModalOpen,
    onClose: onCloseConfirmPinCodeModal,
    onOpen: onOpenConfirmPinCodeModal,
  } = useDisclosure();

  const { isSetNewPinCode, isConfirmPinCode, setNewPinCode, confirmPinCode } =
    usePinCode();

  const {
    control: setPinCodeControl,
    handleSubmit: handleSubmitSetPinCode,
    formState: { isValid: isSetValid },
    reset: resetSetPinCodeForm,
  } = useForm<TPinCodeForm>({});

  const {
    control: confirmPinCodeControl,
    handleSubmit: handleSubmitConfirmPinCode,
    formState: { isValid: isConfirmValid },
    reset: resetConfirmPinCodeForm,
  } = useForm<TPinCodeForm>({
    defaultValues: {
      pinCode: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { sendMoneyToUserWallet } = useMoney();

  const getMemberId = useCallback(
    (email: string): string =>
      filterDataUser?.find(
        (user) =>
          user.email.trim().toLocaleLowerCase() === email.trim().toLowerCase(),
      )?._id || '',
    [filterDataUser],
  );

  const hasPinCode = user?.pinCode;

  const handleTransferMoneySuccess = useCallback(
    (success: { title: string; description: string }) => {
      toast(customToast(success.title, success.description, STATUS.SUCCESS));
      if (user?.bonusTimes) {
        setUser({
          user: {
            ...user,
            bonusTimes: --user.bonusTimes,
          },
        });
      }
    },
    [setUser, toast, user],
  );

  const handleTransferMoneyError = useCallback(
    (
      error: Error,
      defaultError: {
        title: string;
        description: string;
      },
    ) => {
      const responseErrorMessage = getErrorMessageFromAxiosError(
        error as AxiosError<TMoneyResponse>,
        defaultError.description,
      );

      toast(
        customToast(defaultError.title, responseErrorMessage, STATUS.ERROR),
      );
    },
    [toast],
  );

  const handleOnSubmitSendMoney = useCallback(() => {
    hasPinCode ? onOpenConfirmPinCodeModal() : onOpenSetPinCodeModal();
  }, [hasPinCode, onOpenConfirmPinCodeModal, onOpenSetPinCodeModal]);

  const onSubmitSendMoney: SubmitHandler<TTransfer> = useCallback(
    (data) => {
      const submitData: TSendMoney = {
        ...data,
        memberId: getMemberId(data.memberId),
        amount: removeAmountFormat(data.amount),
      };

      sendMoneyToUserWallet(submitData, {
        onSuccess: () =>
          handleTransferMoneySuccess(SUCCESS_MESSAGES.SEND_MONEY),
        onError: (error) =>
          handleTransferMoneyError(error, ERROR_MESSAGES.ADD_MONEY),
      });
      resetSendMoneyForm();
    },
    [
      getMemberId,
      handleTransferMoneyError,
      handleTransferMoneySuccess,
      resetSendMoneyForm,
      sendMoneyToUserWallet,
    ],
  );

  const handleSetNewPinCodeSuccess = useCallback(
    (user: Omit<TUserDetail, 'password'>, pinCode: string) => {
      setUser({ user: { ...user, pinCode } });
      onCloseSetPinCodeModal();
      resetSetPinCodeForm();

      toast(
        customToast(
          SUCCESS_MESSAGES.SET_PIN_CODE.title,
          SUCCESS_MESSAGES.SET_PIN_CODE.description,
          STATUS.SUCCESS,
        ),
      );
    },
    [onCloseSetPinCodeModal, resetSetPinCodeForm, setUser, toast],
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

  const handleConfirmPinCodeSuccess = useCallback(async () => {
    onCloseConfirmPinCodeModal();
    resetConfirmPinCodeForm({
      pinCode: '',
    });

    await handleSubmitSendMoney(onSubmitSendMoney)();
    resetSendMoneyForm();

    toast(
      customToast(
        SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title,
        SUCCESS_MESSAGES.CONFIRM_PIN_CODE.description,
        STATUS.SUCCESS,
      ),
    );
  }, [
    handleSubmitSendMoney,
    onCloseConfirmPinCodeModal,
    onSubmitSendMoney,
    resetConfirmPinCodeForm,
    resetSendMoneyForm,
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
    resetConfirmPinCodeForm();
  }, [resetConfirmPinCodeForm, toast]);

  const onSubmitPinCode: SubmitHandler<TPinCodeForm> = useCallback(
    async (data) => {
      if (user) {
        data.userId = user.id;
        if (!hasPinCode) {
          setNewPinCode(data, {
            onSuccess: () => handleSetNewPinCodeSuccess(user, data.pinCode),
            onError: handleSetNewPinCodeError,
          });
        } else {
          confirmPinCode(data, {
            onSuccess: handleConfirmPinCodeSuccess,
            onError: handleConfirmPinCodeError,
          });
        }
      }
    },
    [
      confirmPinCode,
      handleConfirmPinCodeError,
      handleConfirmPinCodeSuccess,
      handleSetNewPinCodeError,
      handleSetNewPinCodeSuccess,
      hasPinCode,
      setNewPinCode,
      user,
    ],
  );

  const handleCloseSetPinCodeModal = useCallback(() => {
    onCloseSetPinCodeModal();
    resetSetPinCodeForm();
  }, [onCloseSetPinCodeModal, resetSetPinCodeForm]);

  const handleCloseConfirmPinCodeModal = useCallback(() => {
    onCloseConfirmPinCodeModal();
    resetConfirmPinCodeForm();
  }, [onCloseConfirmPinCodeModal, resetConfirmPinCodeForm]);

  return (
    <>
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

        <CardBalance
          balance={currentWalletMoney?.balance || 0}
          isLoadingPinCode={isLoadingPinCode}
          userPinCode={userPinCode}
          onSubmitPinCode={onSubmitPinCodeForm}
          isPinCodeModalOpen={isPinCodeModalOpen}
          onTogglePinCodeModal={onTogglePinCodeModal}
          isShowBalance={isShowBalance}
          onToggleShowBalance={onToggleShowBalance}
        />

        <Box
          as="form"
          mt={4}
          onSubmit={handleSubmitSendMoney(handleOnSubmitSendMoney)}
        >
          <UserSelector control={control} listUser={filterDataUser} />
          <EnterMoney
            isDisabled={!shouldEnable || isSubmitting}
            control={control}
          />
        </Box>
      </Box>
      {/*Set/Confirm PIN code Modal */}
      <PinCodeModal
        title={
          isSetPinCodeModalOpen
            ? 'Please set the PIN code to your account'
            : 'Please enter your PIN code'
        }
        control={hasPinCode ? confirmPinCodeControl : setPinCodeControl}
        isOpen={isSetPinCodeModalOpen || isConfirmPinCodeModalOpen}
        isDisabled={
          hasPinCode
            ? !isConfirmValid || isConfirmPinCode
            : !isSetValid || isSetNewPinCode
        }
        isLoading={hasPinCode ? isConfirmPinCode : isSetNewPinCode}
        onclose={
          isSetPinCodeModalOpen
            ? handleCloseSetPinCodeModal
            : handleCloseConfirmPinCodeModal
        }
        onSubmit={
          hasPinCode
            ? handleSubmitConfirmPinCode(onSubmitPinCode)
            : handleSubmitSetPinCode(onSubmitPinCode)
        }
      />
    </>
  );
};

const CardPaymentMemorized = memo(CardPayment);

export default CardPaymentMemorized;
