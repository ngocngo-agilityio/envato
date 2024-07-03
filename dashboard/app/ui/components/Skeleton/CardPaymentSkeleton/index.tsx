// Libs
import { memo } from 'react';
import { Box, Center, Skeleton } from '@chakra-ui/react';

const CardPaymentSkeleton = () => (
  <Box
    p={4}
    w="full"
    bg="background.body.quaternary"
    py={{ base: 4, md: 5 }}
    px={{ base: 4, md: 10 }}
    borderRadius="lg"
  >
    <Skeleton w="120px" h="22px" mb={3} />

    <Center mb={4}>
      <Skeleton
        borderRadius="lg"
        w={{ base: '100%', sm: 340 }}
        h={{ base: 180, sm: 200 }}
      />
    </Center>

    <Skeleton mb={3} h="27px" w="150px" />
    <Skeleton mb={5} h="56px" borderRadius="lg" />
    <Skeleton mb={4} h="121px" borderRadius="lg" />
    <Skeleton mb={4} h="51px" borderRadius="lg" />
  </Box>
);

const CardPaymentSkeletonMemorized = memo(CardPaymentSkeleton);

export default CardPaymentSkeletonMemorized;
