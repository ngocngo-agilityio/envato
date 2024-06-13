// Libs
import { memo, useCallback } from 'react';
import { Box, Flex, Hide, Text } from '@chakra-ui/react';
import Image from 'next/image';
import isEqual from 'react-fast-compare';

// Constants
import { IMAGES } from '@/lib/constants';

// Utils
import { generatePlaceholder, getStatusColor } from '@/lib/utils';

// Themes
import { useColorfill } from '@/ui/themes/bases/colors';

export type Props = {
  uid?: string;
  avatar?: string;
  name?: string;
  localeTime?: string;
  icon?: React.ReactNode;
  statusColor?: string;
  lastMessage?: string;
  onClick?: (user: {
    uid: string;
    avatarUrl: string;
    displayName: string;
  }) => void;
};

const ChatMember = ({
  uid = '',
  name = '',
  avatar = IMAGES.CHAT_USER_AVATAR.url,
  localeTime = '',
  icon,
  statusColor = '',
  lastMessage = '',
  onClick,
}: Props) => {
  const { secondary } = useColorfill();

  const handleClick = useCallback(() => {
    const user = {
      uid,
      avatarUrl: avatar,
      displayName: name,
    };

    onClick && onClick(user);
  }, [avatar, name, onClick, uid]);

  return (
    <>
      <Hide above="lg">
        <Box
          cursor="pointer"
          _hover={{ bg: secondary }}
          onClick={handleClick}
          borderRadius="lg"
        >
          <Flex justify="space-between" p={3.5}>
            <Flex
              gap={3}
              borderRadius="50%"
              border="1px solid"
              w="48px"
              h="48px"
              position="relative"
            >
              <Image
                src={avatar || IMAGES.CHAT_USER_AVATAR.url}
                alt={avatar}
                width={48}
                height={48}
                placeholder="blur"
                blurDataURL={generatePlaceholder(48, 48)}
                style={{
                  borderRadius: '50%',
                }}
              />

              <Box
                w="15px"
                h="15px"
                bg={getStatusColor(statusColor)}
                top={8}
                left={9}
                position="absolute"
                borderRadius="50%"
                border="3px solid"
                borderColor="common.white"
              />
            </Flex>

            <Flex direction="column" alignItems="center">
              <Text>{localeTime}</Text>
              {icon}
            </Flex>
          </Flex>
        </Box>
      </Hide>
      <Hide below="lg">
        <Box
          cursor="pointer"
          _hover={{ bg: secondary }}
          onClick={handleClick}
          borderRadius="lg"
        >
          <Flex justify="space-between" p={3.5} alignItems="flex-start">
            <Flex gap={3}>
              <Flex
                borderRadius="50%"
                minW="47px"
                h="47px"
                position="relative"
                mr={4}
              >
                <Image
                  src={avatar || IMAGES.CHAT_USER_AVATAR.url}
                  alt={avatar}
                  width={47}
                  height={47}
                  placeholder="blur"
                  blurDataURL={generatePlaceholder(47, 47)}
                  style={{
                    borderRadius: '50%',
                  }}
                />

                <Box
                  w="15px"
                  h="15px"
                  bg={getStatusColor(statusColor)}
                  top="32px"
                  left="35px"
                  position="absolute"
                  borderRadius="50%"
                  border="3px solid"
                  borderColor="common.white"
                />
              </Flex>
              <Flex flexDirection="column" alignItems="flex-start">
                <Box mr={6}>
                  <Text fontSize="18px" fontWeight="bold">
                    {name}
                  </Text>
                </Box>
                <Text
                  color="primary.300"
                  dangerouslySetInnerHTML={{ __html: lastMessage }}
                />
              </Flex>
            </Flex>

            <Flex direction="column" alignItems="center">
              <Text>{localeTime}</Text>
              {icon}
            </Flex>
          </Flex>
        </Box>
      </Hide>
    </>
  );
};

const ChatMemberMemorized = memo(ChatMember, isEqual);

export default ChatMemberMemorized;
