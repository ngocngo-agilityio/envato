'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';

// Components
import { InputSendMessages, Loading, Message } from '@/ui/components';

// Interface
import { TMessages } from '@/lib/interfaces';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import { getInfoRoomChat, useSubscribeToChat } from '@/lib/hooks';

// Firebase
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Utils
import { db } from '@/lib/utils';

// Constants
import { AUTHENTICATION_ROLE, FIREBASE_CHAT } from '@/lib/constants';

const initialUserChat = {
  roomChatId: '',
  userId: '',
  adminId: '',
  avatarUrl: '',
  avatarAdminUrl: '',
  displayName: '',
};

const BoxChat = () => {
  const [messages, setMessages] = useState<TMessages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = authStore((state) => state.user);
  const hasPermission = user?.role === AUTHENTICATION_ROLE.MEMBER;
  const [userChat, setUserChat] = useState(initialUserChat);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const { avatarAdminUrl, avatarUrl, adminId } = userChat || {};

  const fetchData = async () => {
    const usersData = await getInfoRoomChat(user);

    // Check if usersData is undefined before accessing its properties
    if (usersData) {
      const res = await getDoc(
        doc(db, FIREBASE_CHAT.CHATS, usersData.roomChatId),
      );

      setUserChat(usersData);
      res.exists() ? setMessages(res.data().messages) : await createChatRoom();
    }
    setIsLoading(false);
  };

  const createChatRoom = useCallback(async () => {
    // Get user data
    const usersData = await getInfoRoomChat(user);

    if (usersData)
      await setDoc(doc(db, FIREBASE_CHAT.CHATS, usersData.roomChatId), {
        messages: [],
      });
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  useSubscribeToChat(userChat.roomChatId, setMessages, boxRef);

  return (
    hasPermission && (
      <Box w="full" bg="background.body.quaternary" borderRadius="lg">
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          justify="center"
          borderBottom="1px solid"
          borderBottomColor="border.tertiary"
          padding="24px 26px"
        >
          <Heading
            as="h3"
            fontWeight="semibold"
            color="text.primary"
            fontSize="2xl"
            textTransform="capitalize"
          >
            team chat
          </Heading>
        </Flex>

        {isLoading ? (
          <Loading />
        ) : (
          <Box padding={{ base: '24px 20px', lg: '45px 35px' }}>
            <Box
              ref={boxRef}
              overflowX="auto"
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': {
                  width: 2,
                },
                '&::-webkit-scrollbar-track': {
                  width: 2,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'gray',
                  borderRadius: '24px',
                },
              }}
              maxHeight={361}
              padding={5}
            >
              {messages.map((message) => {
                const { text = '', date, senderId = '' } = message || {};
                const { seconds = 0 } = date || {};

                return (
                  <Message
                    content={text}
                    key={seconds}
                    senderId={senderId}
                    avatarAdmin={avatarAdminUrl}
                    avatarUser={avatarUrl}
                    superAdminId={adminId}
                  />
                );
              })}
            </Box>

            <InputSendMessages boxRef={boxRef} />
          </Box>
        )}
      </Box>
    )
  );
};

const BoxChatMemorized = memo(BoxChat);

export default BoxChatMemorized;
