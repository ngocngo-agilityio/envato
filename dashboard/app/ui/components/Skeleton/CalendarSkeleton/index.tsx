'use client';

// Libs
import { memo, useMemo } from 'react';
import { Flex, Skeleton, useMediaQuery } from '@chakra-ui/react';

const CalendarSkeleton = () => {
  const [isLargeThanMobile] = useMediaQuery('(min-width: 768px)');

  const renderNextBackBtnSkeleton = useMemo(
    () => (
      <Flex gap={1}>
        <Skeleton w="30px" h="30px" />
        <Skeleton w="30px" h="30px" />
      </Flex>
    ),
    [],
  );

  return (
    <Flex flexDir="column" minH={{ base: '530px', md: '700px' }}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        wrap="wrap"
        mb={6}
      >
        <Skeleton w={{ base: '100px', md: '150px' }} h={8} />
        <Skeleton w={{ base: '80px', md: '100px' }} h={8} />
        {!isLargeThanMobile && renderNextBackBtnSkeleton}

        <Flex
          alignItems="center"
          wrap="wrap"
          justifyContent="flex-end"
          gap={2}
          w={{ base: '100%', md: 'auto' }}
          mt={{ base: 2, md: 0 }}
        >
          <Flex
            flex={1}
            flexDir={{ base: 'column', md: 'row' }}
            gap={{ base: 3, md: 1 }}
          >
            <Skeleton w={{ base: '100%', md: '60px' }} h={8} />
            <Skeleton w={{ base: '100%', md: '60px' }} h={8} />
            <Skeleton w={{ base: '100%', md: '60px' }} h={8} />
          </Flex>

          {isLargeThanMobile && renderNextBackBtnSkeleton}
        </Flex>
      </Flex>
      <Skeleton flex={1} />
    </Flex>
  );
};

const CalendarSkeletonMemorized = memo(CalendarSkeleton);

export default CalendarSkeletonMemorized;
