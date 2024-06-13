import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ImageProps } from '@chakra-ui/next-js';
import { Box, Flex, Td, Text, Tooltip } from '@chakra-ui/react';

// Utils
import { generatePlaceholder } from '@/lib/utils';

type TUserInfoProps = Pick<ImageProps, 'loading' | 'priority'> & {
  name: string;
  imageURL: string;
  email: string;
};

const UserInfo = ({
  imageURL,
  name,
  email,
  ...imageProps
}: TUserInfoProps): JSX.Element => (
  <Td
    py={5}
    px={4}
    fontSize="md"
    color="text.primary"
    fontWeight="semibold"
    textAlign="left"
    minW={{ base: 470, xl: 270 }}
  >
    <Flex alignItems="center" gap="10px">
      <Box w="50px" h="50px" pos="relative" borderRadius={8} overflow="hidden">
        <Image
          src={`${imageURL}`}
          alt={`Image of ${name}`}
          fill
          sizes="100vw"
          blurDataURL={generatePlaceholder(50, 50)}
          placeholder="blur"
          quality={75}
          objectFit="cover"
          {...imageProps}
        />
      </Box>
      <Box flex={1}>
        <Tooltip minW="max-content" placement="bottom-start" label={name}>
          <Text
            as="h4"
            fontSize="md"
            fontWeight="bold"
            whiteSpace="break-spaces"
            maxW={300}
            noOfLines={1}
          >
            {name}
          </Text>
        </Tooltip>
        <Tooltip minW="max-content" placement="bottom-start" label={`${email}`}>
          <Text
            as={Link}
            href={`mailto:${email}`}
            fontSize="xs"
            fontWeight="medium"
            color="secondary.350"
            flex={1}
            whiteSpace="break-spaces"
            noOfLines={1}
          >
            {email}
          </Text>
        </Tooltip>
      </Box>
    </Flex>
  </Td>
);

const UserInfoCellMemorized = memo(UserInfo);

export default UserInfoCellMemorized;
