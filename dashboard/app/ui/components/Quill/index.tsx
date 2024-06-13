import dynamic from 'next/dynamic';

import { useCallback, useEffect, useId, memo } from 'react';
import { VStack, Flex, Text } from '@chakra-ui/react';
import 'react-quill/dist/quill.snow.css';
import { Controller, useForm } from 'react-hook-form';

// Components
import { SendIconLight } from '..';
import CustomButton from '@/ui/components/common/Button';

// Constants
import { IMAGES, QUILL_SCHEMA, REGEX } from '@/lib/constants';

// Hooks
import { sendMessage } from '@/lib/utils';

// Stores
import { authStore } from '@/lib/stores';

// Interfaces
import { TMessages } from '@/lib/interfaces';

// Themes
import { useColorfill } from '@/ui/themes/bases';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface QuillProps {
  userAvatar: string;
  userName: string;
  userUid?: string;
}

const Quill = ({
  userUid = '',
  userAvatar = IMAGES.AVATAR.url,
  userName = 'User',
}: QuillProps) => {
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

  const { quinary } = useColorfill();

  const handleSend = useCallback(
    async (data: TMessages) => {
      const filterMessage = data.text.replace(REGEX.HTML_TAG_PATTERN, '');

      const dataMessage: TMessages = {
        ...data,
        text: filterMessage,
      };

      const idRoomChat = `${currentUser?.uid}${userUid}`;
      const adminId = currentUser?.uid as string;

      await sendMessage(
        dataMessage,
        idRoomChat,
        userUid || '',
        adminId,
        userAvatar,
        currentUser?.avatarURL || '',
        userName,
      );

      reset();
    },
    [currentUser, userUid, userAvatar, userName, reset],
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
          rules={QUILL_SCHEMA.MESSAGES}
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
                    backgroundColor: quinary,
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

const QuillMemorized = memo(Quill);

export default QuillMemorized;
