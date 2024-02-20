import dynamic from 'next/dynamic';

import { useCallback, useEffect, useId } from 'react';
import { VStack, Flex, Text, useColorModeValue, theme } from '@chakra-ui/react';
import 'react-quill/dist/quill.snow.css';
import { Controller, useForm } from 'react-hook-form';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Components
import { SendIconLight } from '..';
import CustomButton from '@/ui/components/common/Button';

// Interfaces
import { TMessages } from '@/lib/interfaces';

// Stores
import { authStore } from '@/lib/stores';

// bases
import { colors } from '@/ui/themes/bases';

// Hooks
import { getUserList } from '@/lib/hooks';
import { sendMessage } from '@/lib/utils';

interface QuillProps {
  userUid: string | undefined;
}

const Quill = ({ userUid }: QuillProps) => {
  const currentUser = authStore((state) => state.user);

  // TODO: get from list users
  // const senderId = user?.id || '';

  // TODO: if have real id from database
  // const idRoomChat = useGetRoomChat();

  const {
    control,
    formState: {
      errors: { root },
      isValid,
      isSubmitting,
    },
    handleSubmit,
    reset,
  } = useForm<TMessages>({
    defaultValues: {
      text: '',
      id: useId(),
      senderId: currentUser?.uid,
      date: { nanoseconds: 0, seconds: 0 },
    },
    mode: 'onBlur',
  });

  const colorFill = useColorModeValue(
    theme.colors.white,
    colors.secondary[400],
  );

  const handleSend = useCallback(
    async (data: TMessages) => {
      const usersData = await getUserList(currentUser);
      const userChat = usersData.find((item) => item.uid === userUid);
      const filterMessage = data.text.replace(/<\/?[^>]+(>|$)/g, '');

      const dataMessage: TMessages = {
        ...data,
        text: filterMessage,
      };

      if (usersData) {
        const idRoomChat = `${currentUser?.uid}${userChat?.uid}`;
        const adminId = currentUser?.uid as string;

        await sendMessage(
          dataMessage,
          idRoomChat,
          userUid || '',
          adminId,
          userChat?.avatarURL || '',
          currentUser?.avatarURL || '',
          `${userChat?.firstName} ${userChat?.lastName}`,
        );

        reset();
      }
    },
    [reset, currentUser, userUid],
  );

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();

        handleSubmit(handleSend)();
        reset();
      }
    },
    [handleSubmit, handleSend, reset],
  );

  useEffect(() => {
    const tooltip = document.querySelector('.ql-tooltip');
    tooltip?.remove();
  });

  return (
    <VStack as="form" onSubmit={handleSubmit(handleSend)}>
      <Flex direction="column" width="full">
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, ...rest } }) => (
            <Flex direction="row" alignItems="center">
              <Flex width="full" alignItems="center" justify="flex-start">
                <ReactQuill
                  {...rest}
                  onKeyDown={handleOnKeyDown}
                  onChange={onChange}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      ['image', 'code-block'],
                    ],
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: colorFill,
                  }}
                  theme="snow"
                />
              </Flex>
            </Flex>
          )}
        />

        <Text color="red" textAlign="center" py={2} h={10}>
          {root?.message}
        </Text>
        <CustomButton
          w="100px"
          h="40px"
          px={4}
          ml={4}
          py={2.5}
          leftIcon={<SendIconLight />}
          fontSize="md"
          fontWeight="semibold"
          bgColor="primary.600"
          alignSelf="flex-end"
          type="submit"
          isDisabled={!isValid || isSubmitting}
        >
          Send
        </CustomButton>
      </Flex>
    </VStack>
  );
};

export default Quill;
