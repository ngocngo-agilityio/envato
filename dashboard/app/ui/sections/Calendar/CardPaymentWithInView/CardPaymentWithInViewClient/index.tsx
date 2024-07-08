'use client';

// Libs
import { ReactNode } from 'react';
import { GridItem } from '@chakra-ui/react';
import { InView } from 'react-intersection-observer';

interface CardPaymentWithInViewProps {
  children: ReactNode;
}

const CardPaymentWithInViewClient = ({
  children,
}: CardPaymentWithInViewProps) => (
  <InView>
    {({ inView, ref }) => (
      <GridItem mt={{ base: 6, '2xl': 0 }} ref={ref}>
        {inView && children}
      </GridItem>
    )}
  </InView>
);

export default CardPaymentWithInViewClient;
