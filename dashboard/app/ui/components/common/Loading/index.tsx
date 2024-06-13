'use client';

// Libs
import { memo } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

const Loading = () => (
  <Flex justifyContent="center" p={5}>
    <Spinner />
  </Flex>
);

const LoadingMemorized = memo(Loading);

export default LoadingMemorized;
