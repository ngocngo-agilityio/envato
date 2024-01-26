'use client';

import { useEffect, useState } from 'react';
import {
  Text,
  Flex,
  theme,
  useColorModeValue,
  Grid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';

// Firebase
import { convertTimeMessage, db } from '@/lib/utils';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

// Components
import {
  ChatMember,
  Conversation,
  EditIcon,
  FallbackImage,
} from '@/ui/components';

// Hooks
import { getUsers } from '@/lib/hooks';

// Store
import { authStore } from '@/lib/stores';
import { FIREBASE_CHAT, IMAGES } from '@/lib/constants';

// Interfaces
import { TMessages } from '@/lib/interfaces';

type TChats = {
  userInfo: { uid: string; avatarUrl: string; displayName: string };
  lastMessage: { text: string };
  date: { seconds: number };
};

const ChatMemberList = () => {
  const colorFill = useColorModeValue(
    theme.colors.gray[800],
    theme.colors.white,
  );

  // const timeMessage = new Date().toLocaleTimeString([], {
  //   hour: 'numeric',
  //   minute: '2-digit',
  // });

  const isMobile = useBreakpointValue({ base: true, lg: false });

  const [adminUid, setAdminUid] = useState<string>('');
  const [chats, setChats] = useState<TChats[]>([]);
  const [messages, setMessages] = useState<TMessages[]>([]);
  const [roomChatId, setRoomChatId] = useState<string | null>(null);
  const [showRoom, setShowRoom] = useState<boolean>(false);
  const [nameUser, setNameUser] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');

  const currentUser = authStore((state) => state.user);

  const handleMemberClick = async (user: {
    uid: string;
    avatarUrl: string;
    displayName: string;
  }) => {
    try {
      const usersData = await getUsers();

      const combinedId = usersData?.adminId + user.uid;
      const chatDocRef = doc(db, FIREBASE_CHAT.CHATS, combinedId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (!chatDocSnap.exists()) {
        await setDoc(chatDocRef, { messages: [] });
      }

      setRoomChatId(combinedId);

      const chatSnapshot = await getDoc(chatDocRef);
      const chatData = chatSnapshot.data();
      setMessages(chatData?.messages || []);
      setAdminUid(user.uid);
      setNameUser(user.displayName);
      setAvatar(user.avatarUrl);
      setShowRoom(true);
    } catch (error) {
      console.error('Error handling member click:', error);
    }
  };

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, FIREBASE_CHAT.USER_CHATS, `${currentUser?.uid}`),
        (doc) => {
          setChats(doc.data() as TChats[]);
        },
      );

      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!roomChatId) return;
    const unSub = onSnapshot(
      doc(db, FIREBASE_CHAT.CHATS, roomChatId),
      (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      },
    );

    return () => {
      unSub();
    };
  }, [roomChatId]);

  return (
    <Grid
      templateColumns="repeat(12, minmax(0, 1fr))"
      borderTop="1px solid"
      borderColor="border.tertiary"
    >
      {isMobile ? (
        <GridItem
          colSpan={12}
          mb={4}
          padding={2}
          bg="background.body.septenary"
        >
          <Flex justify="flex-start" overflowX="scroll">
            {Object.entries(chats)
              ?.sort((a, b) => b[1].date?.seconds - a[1].date?.seconds)
              .map((chat) => (
                <ChatMember
                  key={chat[0]}
                  avatar={chat[1].userInfo?.avatarUrl}
                  onClick={() => handleMemberClick(chat[1].userInfo)}
                />
              ))}
          </Flex>
        </GridItem>
      ) : (
        <GridItem
          colSpan={4}
          bg="background.body.septenary"
          pt={6}
          pr={7}
          pl={12}
          pb={10}
          borderRight="1px solid"
          borderColor="border.tertiary"
          height="calc(100vh - 103px)"
          overflowY="scroll"
        >
          <Flex justify="space-between" align="center">
            <Text
              as="h3"
              color="text.primary"
              fontWeight="semibold"
              fontSize="3xl"
            >
              Messages
              <Text
                as="span"
                color="text.primary"
                fontWeight="semibold"
                fontSize="3xl"
              >
                ({Object.values(chats).length})
              </Text>
            </Text>
            <EditIcon color={colorFill} />
          </Flex>
          <Flex direction="column" gap={6} py={3.5}>
            {Object.entries(chats)
              ?.sort((a, b) => b[1].date?.seconds - a[1].date?.seconds)
              .map((chat) => (
                <ChatMember
                  key={chat[0]}
                  avatar={chat[1].userInfo?.avatarUrl}
                  name={chat[1].userInfo?.displayName}
                  onClick={() => handleMemberClick(chat[1].userInfo)}
                  icon={
                    <FallbackImage
                      boxSize={4}
                      src={IMAGES.ATTACH.url}
                      alt={IMAGES.ATTACH.alt}
                    />
                  }
                  localeTime={convertTimeMessage(chat[1].date?.seconds)}
                  lastMessages={chat[1]?.lastMessage?.text}
                />
              ))}
          </Flex>
        </GridItem>
      )}
      {showRoom && (
        <GridItem colSpan={isMobile ? 12 : 8}>
          <Conversation
            nameUser={nameUser}
            avatarUser={avatar}
            messages={messages}
            adminUid={adminUid}
          />
        </GridItem>
      )}
    </Grid>
  );
};

export default ChatMemberList;
