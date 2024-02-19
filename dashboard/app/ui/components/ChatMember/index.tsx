import { memo } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  AvatarBadge,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';

// Themes
import { colors } from '@/ui/themes/bases/colors';

// Utils
import { generatePlaceholder, getStatusColor } from '@/lib/utils';

// Constants
import { IMAGES } from '@/lib/constants';
import Image from 'next/image';

export type Props = {
  avatar?: string;
  name?: string;
  localeTime?: string;
  icon?: React.ReactNode;
  statusColor?: string;
  onClick?: () => void;
  lastMessages?: string;
};

const ChatMember = ({
  avatar = IMAGES.CHAT_USER_AVATAR.url,
  name,
  lastMessages,
  localeTime,
  icon,
  statusColor = '',
  onClick,
}: Props) => {
  const colorFill = useColorModeValue(
    colors.secondary[200],
    colors.secondary[600],
  );

  const isMobile = useBreakpointValue({ base: true, lg: false });

  return isMobile ? (
    <Box
      cursor="pointer"
      _hover={{ bg: colorFill }}
      onClick={onClick}
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
  ) : (
    <Box
      cursor="pointer"
      _hover={{ bg: colorFill }}
      onClick={onClick}
      borderRadius="lg"
    >
      <Flex justify="space-between" p={3.5}>
        <Flex gap={3}>
          <Avatar
            src={avatar}
            borderRadius="50%"
            border="1px solid"
            borderColor="border.tertiary"
          >
            <AvatarBadge boxSize={4} bg={getStatusColor(statusColor)} top={7} />
          </Avatar>
          <Flex flexDirection="column">
            <Box mr={6}>
              <Text fontSize="24px" fontWeight="bold">
                {name}
              </Text>
            </Box>
            <Text
              color="primary.300"
              dangerouslySetInnerHTML={{ __html: lastMessages ?? '' }}
            />
          </Flex>
        </Flex>

        <Flex direction="column" alignItems="center">
          <Text>{localeTime}</Text>
          {icon}
        </Flex>
      </Flex>
    </Box>
  );
};

const ChatMemberMemorized = memo(ChatMember);

export default ChatMemberMemorized;
