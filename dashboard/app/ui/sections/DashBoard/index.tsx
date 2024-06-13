'use client';

import lazy from 'next/dynamic';
import { InView } from 'react-intersection-observer';
import { Box, Grid, GridItem, Stack } from '@chakra-ui/react';

// Stores
import { authStore } from '@/lib/stores';

// Components
import { TotalStatisticList } from '@/ui/components';

// Lazy load components
const CardPayment = lazy(() => import('@/ui/components/CardPayment'));
const BoxChat = lazy(() => import('@/ui/components/BoxChat'));
const RevenueFlow = lazy(() => import('@/ui/components/RevenueFlow'));
const Efficiency = lazy(() => import('@/ui/components/Efficiency'));
const TransactionTable = lazy(() => import('@/ui/components/TransactionTable'));
const CheckPinCode = lazy(() => import('@/ui/providers/CheckPinCode'));

const DashBoard = () => {
  const user = authStore((state) => state.user);

  return (
    <>
      <Grid
        display={{ sm: 'block', md: 'grid' }}
        bg="background.body.primary"
        p={{ base: 6, xl: 12 }}
        templateColumns={{ base: 'repeat(1, 1fr)', '5xl': 'repeat(4, 1fr)' }}
        gap={0}
      >
        <GridItem colSpan={3}>
          <TotalStatisticList />

          <InView>
            {({ inView, ref }) => (
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                mt={6}
                gap={6}
                ref={ref}
                minH={250}
              >
                <GridItem colSpan={{ base: 3, xl: 2 }}>
                  {inView && <RevenueFlow />}
                </GridItem>

                <GridItem ref={ref} display={{ base: 'none', xl: 'block' }}>
                  {inView && <Efficiency />}
                </GridItem>
              </Grid>
            )}
          </InView>

          <InView>
            {({ inView, ref }) => (
              <Box
                ref={ref}
                mt={6}
                as="section"
                bgColor="background.component.primary"
                borderRadius={8}
                px={6}
                py={5}
                minH={500}
              >
                {inView && <TransactionTable />}
              </Box>
            )}
          </InView>
        </GridItem>

        <InView>
          {({ inView, ref }) => (
            <GridItem
              mt={{ base: 6, '5xl': 0 }}
              ml={{ '5xl': 12 }}
              ref={ref}
              minH={500}
            >
              {inView && (
                <Stack
                  direction={{ base: 'column', lg: 'row', '2xl': 'column' }}
                  spacing={{ base: 6, lg: 0 }}
                >
                  <Box w="full">
                    <CardPayment />
                  </Box>

                  <Box
                    w="full"
                    mt={{ base: 6, md: 0, '3xl': 6 }}
                    ml={{ lg: 6, '2xl': 0 }}
                  >
                    <BoxChat />
                  </Box>
                </Stack>
              )}
            </GridItem>
          )}
        </InView>
      </Grid>
      {!user?.pinCode && <CheckPinCode />}
    </>
  );
};

export default DashBoard;
