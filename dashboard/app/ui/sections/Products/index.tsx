'use client';
import { InView } from 'react-intersection-observer';
import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// dynamic loading components
const ProductsTable = dynamic(() => import('@/ui/components/ProductsTable'));
const CardPayment = dynamic(() => import('@/ui/components/CardPayment'));
const BoxChat = dynamic(() => import('@/ui/components/BoxChat'));

const Products = () => (
  <Grid
    bg="background.body.primary"
    py={12}
    px={{ base: 6, xl: 12 }}
    templateColumns={{ base: 'repeat(1, 1fr)', '2xl': 'repeat(4, 1fr)' }}
    display={{ sm: 'block', md: 'grid' }}
    gap={{ base: 0, '2xl': 12 }}
  >
    <InView>
      {({ inView, ref }) => (
        <GridItem colSpan={3} ref={ref}>
          <Box
            as="section"
            bgColor="background.component.primary"
            borderRadius={8}
            px={6}
            py={5}
          >
            {inView && <ProductsTable />}
          </Box>
        </GridItem>
      )}
    </InView>
    <InView>
      {({ inView, ref }) => (
        <GridItem mt={{ base: 6, '2xl': 0 }} ref={ref}>
          <Flex direction={{ base: 'column', lg: 'row', xl: 'column' }} gap={6}>
            {inView && <CardPayment />}
            {inView && <BoxChat />}
          </Flex>
        </GridItem>
      )}
    </InView>
  </Grid>
);

export default Products;
