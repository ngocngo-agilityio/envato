'use client';

// Libs
import { useRef, useEffect, memo } from 'react';
import { Box } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';

// Components
import { MessageAdmin, Quill } from '@/ui/components';

// store
import { authStore } from '@/lib/stores';

// Interface
import { TMessages } from '@/lib/interfaces';

// Utils
import { convertTimeMessage } from '@/lib/utils';

export type Props = {
  messages: TMessages[];
  adminUid?: string;
  userAvatar: string;
  userName: string;
};

const ListMessages = ({ messages, adminUid, userAvatar, userName }: Props) => {
  const user = authStore((state) => state.user);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const { uid = '', avatarURL = '' } = user || {};

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  });

  return (
    <Box padding={{ base: '24px 20px', lg: '38px 35px' }}>
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
        maxHeight="calc(100vh - 470px)"
        padding={5}
      >
        {messages.map((message) => {
          const { senderId = '', text = '', date } = message || {};
          const { seconds = 0 } = date || {};
          const isSuperAdmin = senderId === uid;

          return (
            <MessageAdmin
              content={text}
              key={seconds}
              senderId={senderId}
              isSuperAdmin={isSuperAdmin}
              userAvatar={userAvatar}
              adminAvatar={avatarURL}
              localeTime={convertTimeMessage(seconds)}
            />
          );
        })}
      </Box>
      <Quill userUid={adminUid} userName={userName} userAvatar={userAvatar} />
    </Box>
  );
};

const ListMessagesMemorized = memo(ListMessages, isEqual);

export default ListMessagesMemorized;
