import { memo } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';

// Components
import { ChatMember, ListMessages } from '..';

// Constants
import { IMAGES } from '@/lib/constants';

// Interface
import { TMessages } from '@/lib/interfaces';

export type Props = {
  userName: string;
  userAvatar: string;
  messages: TMessages[];
  adminUid?: string;
};

const Conversation = ({
  userName,
  userAvatar = IMAGES.AVATAR.url,
  messages = [],
  adminUid = '',
}: Props) => {
  const defaultName = userName;

  return (
    <Box w="full" borderRadius="lg">
      <Flex
        direction="row"
        justifyContent="space-between"
        padding={{ base: '8px', lg: '24px 26px' }}
        bg="background.body.septenary"
      >
        <Heading
          as="h3"
          fontWeight="semibold"
          color="text.primary"
          fontSize="2xl"
          textTransform="capitalize"
        >
          <ChatMember
            avatar={userAvatar}
            name={defaultName}
            statusColor="online"
          />
        </Heading>
      </Flex>

      <ListMessages
        userAvatar={userAvatar}
        messages={messages}
        adminUid={adminUid}
        userName={userName}
      />
    </Box>
  );
};

const ConversationMemorized = memo(Conversation, isEqual);

export default ConversationMemorized;
