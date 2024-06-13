import dynamic from 'next/dynamic';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

//Components
import { Flex, Grid, GridItem } from '@chakra-ui/react';

// Type
import { IEfficiency, TOverallBalance } from '@/lib/interfaces';

// Constants
import { END_POINTS } from '@/lib/constants';

// Utils
import { prefetch } from '@/lib/utils';
import { MyWalletSection } from '@/ui/sections';

// Lazy loading components
const CardPayment = dynamic(() => import('@/ui/components/CardPayment'));
const TotalBalance = dynamic(() => import('@/ui/components/TotalBalance'));

const MyWallets = async () => {
  const queryClient = new QueryClient();

  await prefetch<IEfficiency[]>(`${END_POINTS.EFFICIENCY}/weekly`, queryClient);

  await prefetch<TOverallBalance>(END_POINTS.OVERALL_BALANCE, queryClient);

  return (
    <Grid
      bg="background.body.primary"
      px={{ base: 6, md: 12 }}
      py={12}
      templateColumns={{ base: 'repeat(1, 1fr)', '3xl': 'repeat(4, 1fr)' }}
      gap={{ base: 0, '2xl': 6 }}
      display={{ sm: 'block', xl: 'grid' }}
      minH="100vh"
    >
      <GridItem colSpan={1}>
        <Flex w="full" direction="column" gap={6}>
          <TotalBalance />
          <CardPayment />
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 1, xl: 3 }} mt={{ base: 6, '3xl': 0 }}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MyWalletSection />
        </HydrationBoundary>
      </GridItem>
    </Grid>
  );
};

export default MyWallets;
