'use client';

// Libs
import { GridItem } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { InView } from 'react-intersection-observer';

// Components
import { CardPaymentSkeleton } from '@/ui/components';

// Dynamic loading components
const CardPayment = dynamic(() => import('@/ui/components/CardPayment'), {
  loading: () => <CardPaymentSkeleton />,
});

const CardPaymentWithInView = () => (
  <InView>
    {({ inView, ref }) => (
      <GridItem mt={{ base: 6, '2xl': 0 }} ref={ref}>
        {inView && <CardPayment />}
      </GridItem>
    )}
  </InView>
);

export default CardPaymentWithInView;
