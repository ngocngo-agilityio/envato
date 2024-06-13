'use client';

import { useState, useCallback, RefObject, useId, memo } from 'react';
import { VStack, Flex, FormControl, Text } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import isEqual from 'react-fast-compare';

// Components
import { InputField, Button } from '@/ui/components';
import { SendIcon } from '@/ui/components/Icons';

// Hooks
import { getInfoRoomChat } from '@/lib/hooks';

// Stores
import { authStore } from '@/lib/stores';

// Utils
import { sendMessage } from '@/lib/utils';

// Interfaces
import { TMessages } from '@/lib/interfaces';

interface InputSendMessagesProps {
  boxRef: RefObject<HTMLDivElement>;
}

const InputSendMessages = ({ boxRef }: InputSendMessagesProps) => {
  const user = authStore((state) => state.user);

  const [isSubmit] = useState<boolean>(false);

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
      senderId: '',
      date: { nanoseconds: 0, seconds: 0 },
    },
    mode: 'onBlur',
  });

  const handleSend = useCallback(
    async (data: TMessages) => {
      const usersData = await getInfoRoomChat(user);

      if (usersData) {
        const {
          userId: senderUserId,
          roomChatId,
          adminId: receiverId,
          avatarUrl,
          avatarAdminUrl,
          displayName,
        } = usersData;

        data.senderId = senderUserId;

        await sendMessage(
          data,
          roomChatId,
          senderUserId,
          receiverId,
          avatarUrl,
          avatarAdminUrl,
          displayName,
        );

        if (boxRef && boxRef.current) {
          boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
        reset();
      }
    },
    [boxRef, reset, user],
  );

  return (
    <VStack as="form" onSubmit={handleSubmit(handleSend)}>
      <Flex justify="center" align="center" w="full">
        <Controller
          control={control}
          rules={{ required: true }}
          defaultValue=""
          name="text"
          render={({ field: { onChange, ...rest } }) => (
            <FormControl>
              <Flex direction="row" alignItems="center" justify="flex-start">
                <InputField
                  placeholder="Type your message..."
                  variant="tertiary"
                  _placeholder={{
                    color: 'secondary.450',
                  }}
                  {...rest}
                  isDisabled={isSubmit}
                  onChange={onChange}
                />
              </Flex>
            </FormControl>
          )}
        />
        <Text color="red" textAlign="center" py={2} h={10}>
          {root?.message}
        </Text>
        <Button
          data-testid="btn-send"
          backgroundColor="transparent"
          borderRadius="none"
          ml={5}
          w={5}
          h={18}
          cursor="pointer"
          type="submit"
          isDisabled={!isValid || isSubmitting}
        >
          <SendIcon />
        </Button>
      </Flex>
    </VStack>
  );
};

const InputSendMessagesMemorized = memo(InputSendMessages, isEqual);

export default InputSendMessagesMemorized;
