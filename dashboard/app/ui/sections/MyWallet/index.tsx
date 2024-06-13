'use client';

import dynamic from 'next/dynamic';
import { InView } from 'react-intersection-observer';
import { Box, Flex } from '@chakra-ui/react';

// Lazy loading components
const TransactionTable = dynamic(
  () => import('@/ui/components/TransactionTable'),
);
const Efficiency = dynamic(() => import('@/ui/components/Efficiency'));
const OverallBalance = dynamic(() => import('@/ui/components/OverallBalance'));

const MyWallet = () => (
  <InView>
    {({ inView, ref }) => (
      <Flex direction="column" gap={6} ref={ref}>
        <Flex
          flex={1}
          gap={6}
          direction={{ base: 'column', xl: 'row' }}
          boxSizing="border-box"
          w="100%"
        >
          <Box w={{ '3xl': '65%' }} flex={2}>
            {inView && <OverallBalance />}
          </Box>
          <Box w={{ '3xl': '35%' }} flex={1}>
            {inView && <Efficiency />}
          </Box>
        </Flex>
        <Box>
          <Box
            as="section"
            bgColor="background.component.primary"
            borderRadius={8}
            px={6}
            py={5}
          >
            {inView && <TransactionTable />}
          </Box>
        </Box>
      </Flex>
    )}
  </InView>
);

export default MyWallet;
