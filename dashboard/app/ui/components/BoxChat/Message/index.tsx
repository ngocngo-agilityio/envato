// Libs
import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import { useEffect, useState, memo } from 'react';
import Image from 'next/image';

// Constants
import { IMAGES } from '@/lib/constants';

// Utils
import { generatePlaceholder } from '@/lib/utils';

interface MessageProps {
  content?: string;
  avatarUser?: string;
  avatarAdmin?: string;
  localeTime?: string;
  senderId: string;
  superAdminId: string;
}

const Message = ({
  senderId,
  content = '',
  avatarUser = IMAGES.CHAT_USER_AVATAR.url,
  avatarAdmin = IMAGES.CHAT_USER_AVATAR.url,
  localeTime = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  }),
  superAdminId,
}: MessageProps) => {
  const [adminId, setAdminId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setAdminId(superAdminId || '');
    };

    fetchData();
  }, []);

  const isAdmin = senderId === adminId;

  return (
    <Flex width="100%" justifyContent={!isAdmin ? 'flex-end' : 'flex-start'}>
      {isAdmin && (
        <Box pos="relative" w={9} h={9}>
          <Image
            src={avatarAdmin}
            alt={avatarAdmin}
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={generatePlaceholder(36, 36)}
            objectFit="cover"
            style={{
              borderRadius: '50%',
              marginRight: '8px',
            }}
          />
        </Box>
      )}

      <Flex
        align="flex-end"
        direction={!isAdmin ? 'row-reverse' : 'row'}
        mb="30px"
        alignItems="center"
      >
        <Box
          data-testid="image-container"
          bg={!isAdmin ? 'primary.300' : 'background.section.messageUser'}
          p={3}
          ml={2}
          borderRadius={8}
          color="text.primary"
          dangerouslySetInnerHTML={{ __html: content ?? '' }}
        />
        <Spacer />

        <Text
          ml={3}
          mr={3}
          fontSize="xs"
          color="text.textTime"
          fontWeight="medium"
          minW="max-content"
        >
          {localeTime}
        </Text>
      </Flex>

      {!isAdmin && (
        <Box pos="relative" w={9} h={9}>
          <Image
            src={avatarUser}
            alt={avatarUser}
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={generatePlaceholder(36, 36)}
            objectFit="cover"
            style={{
              borderRadius: '50%',
              marginLeft: '8px',
            }}
          />
        </Box>
      )}
    </Flex>
  );
};

const MessageMemorized = memo(Message);
export default MessageMemorized;
