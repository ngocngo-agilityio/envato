import { ReactElement, memo, useCallback, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Center,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Components
import { Eye, EyeSlash } from '@/ui/components/Icons';
import { PinCode } from '..';

// Constants
import {
  ERROR_MESSAGES,
  IMAGES,
  STATUS,
  SUCCESS_MESSAGES,
} from '@/lib/constants';

// Hooks
import { useAuth, usePinCode } from '@/lib/hooks';

// Store
import { TAuthStoreData, authStore } from '@/lib/stores';

// Utils
import { customToast, formatDecimalNumber } from '@/lib/utils';

// Types
import { TPinCodeForm } from '@/lib/interfaces';

// Lazy loading components
const Modal = dynamic(() => import('@/ui/components/common/Modal'));

type TBalanceStatus = {
  balance: string;
  iconBalance: ReactElement;
};

export type TCardProps = {
  balance: number;
};
const Card = ({ balance }: TCardProps) => {
  const { isOpen: isShowBalance, onToggle: onToggleShowBalance } =
    useDisclosure({ defaultIsOpen: true });

  const {
    handleSetPinCode,
    handleConfirmPinCode,
    isConfirmPinCodeModalOpen,
    isSetPinCodeModalOpen,
    onCloseConfirmPinCodeModal,
    onCloseSetPinCodeModal,
    onOpenConfirmPinCodeModal,
    onOpenSetPinCodeModal,
  } = usePinCode();

  const { iconBalance, balance: balanceStatus }: TBalanceStatus = {
    iconBalance: isShowBalance ? <EyeSlash /> : <Eye />,
    balance: isShowBalance ? '******' : `$${formatDecimalNumber(balance)}`,
  };

  const {
    control: setPinCodeControl,
    handleSubmit: handleSubmitSetPinCode,
    formState: { isValid: isSetValid, isSubmitting: isSetSubmitting },
    reset: resetSetPinCodeForm,
  } = useForm<TPinCodeForm>({});

  const {
    control: confirmPinCodeControl,
    handleSubmit: handleSubmitConfirmPinCode,
    formState: { isValid: isConfirmValid, isSubmitting: isConfirmSubmitting },
    reset: resetConfirmPinCodeForm,
  } = useForm<TPinCodeForm>({
    defaultValues: {
      pinCode: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const user = authStore((state): TAuthStoreData['user'] => state.user);

  const { setUser } = useAuth();

  const toast = useToast();

  const handleToggleShowBalance = useCallback(() => {
    if (!isShowBalance) {
      onToggleShowBalance();
    } else {
      if (!user?.pinCode) {
        onOpenSetPinCodeModal();
      } else {
        onOpenConfirmPinCodeModal();
      }
    }
  }, [
    isShowBalance,
    onOpenConfirmPinCodeModal,
    onOpenSetPinCodeModal,
    onToggleShowBalance,
    user?.pinCode,
  ]);

  const onSubmitPinCode: SubmitHandler<TPinCodeForm> = useCallback(
    async (data) => {
      if (user) {
        data.userId = user.id;
        if (!user?.pinCode) {
          try {
            await handleSetPinCode(data);

            setUser({ user: { ...user, pinCode: data.pinCode } });

            onCloseSetPinCodeModal();

            resetSetPinCodeForm();

            toast(
              customToast(
                SUCCESS_MESSAGES.SET_PIN_CODE.title,
                SUCCESS_MESSAGES.SET_PIN_CODE.description,
                STATUS.SUCCESS,
              ),
            );
          } catch (error) {
            toast(
              customToast(
                SUCCESS_MESSAGES.SET_PIN_CODE.title,
                SUCCESS_MESSAGES.SET_PIN_CODE.description,
                STATUS.SUCCESS,
              ),
            );
          }
        } else {
          try {
            await handleConfirmPinCode(data);
            onCloseConfirmPinCodeModal();
            resetConfirmPinCodeForm({
              pinCode: '',
            });
            onToggleShowBalance();

            toast(
              customToast(
                SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title,
                SUCCESS_MESSAGES.CONFIRM_PIN_CODE.description,
                STATUS.SUCCESS,
              ),
            );
          } catch (error) {
            toast(
              customToast(
                ERROR_MESSAGES.CONFIRM_PIN_CODE.title,
                ERROR_MESSAGES.CONFIRM_PIN_CODE.description,
                STATUS.ERROR,
              ),
            ),
              resetConfirmPinCodeForm();
          }
        }
      }
    },
    [
      handleConfirmPinCode,
      handleSetPinCode,
      onCloseConfirmPinCodeModal,
      onCloseSetPinCodeModal,
      onToggleShowBalance,
      resetConfirmPinCodeForm,
      resetSetPinCodeForm,
      setUser,
      toast,
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

  const pinCodeModalBody = useMemo(
    () =>
      user?.pinCode ? (
        <PinCode
          control={confirmPinCodeControl}
          isDisabled={!isConfirmValid || isConfirmSubmitting}
          onSubmit={handleSubmitConfirmPinCode(onSubmitPinCode)}
          onClose={handleCloseConfirmPinCodeModal}
        />
      ) : (
        <PinCode
          control={setPinCodeControl}
          isDisabled={!isSetValid || isSetSubmitting}
          onSubmit={handleSubmitSetPinCode(onSubmitPinCode)}
          onClose={handleCloseSetPinCodeModal}
        />
      ),
    [
      confirmPinCodeControl,
      handleCloseConfirmPinCodeModal,
      handleCloseSetPinCodeModal,
      handleSubmitConfirmPinCode,
      handleSubmitSetPinCode,
      isConfirmSubmitting,
      isConfirmValid,
      isSetSubmitting,
      isSetValid,
      onSubmitPinCode,
      setPinCodeControl,
      user?.pinCode,
    ],
  );

  return (
    <>
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
              onClick={handleToggleShowBalance}
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

      {/*Set PIN code Modal */}
      {isSetPinCodeModalOpen && (
        <Modal
          title="Please set the PIN code to your account"
          isOpen={isSetPinCodeModalOpen}
          onClose={handleCloseSetPinCodeModal}
          body={pinCodeModalBody}
        />
      )}

      {/*Confirm PIN code Modal */}
      {isConfirmPinCodeModalOpen && (
        <Modal
          title="Please enter your PIN code"
          isOpen={isConfirmPinCodeModalOpen}
          onClose={handleCloseConfirmPinCodeModal}
          body={pinCodeModalBody}
        />
      )}
    </>
  );
};

const CardBalance = memo(Card);

export default CardBalance;
