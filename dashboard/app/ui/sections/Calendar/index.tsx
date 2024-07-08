// Libs
import { Suspense } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';

// Components
import { CalendarSkeleton, CardPaymentSkeleton } from '@/ui/components';
import CalendarEvents from './CalendarEvents';
import CardPayment from './CardPayment';

const CalendarSection = () => (
  <Grid
    bg="background.body.primary"
    py={12}
    px={{ base: 6, xl: 12 }}
    templateColumns={{ base: 'repeat(1, 1fr)', '2xl': 'repeat(4, 1fr)' }}
    display={{ sm: 'block', md: 'grid' }}
    gap={{ base: 0, '2xl': 12 }}
  >
    <GridItem colSpan={3}>
      <Box
        as="section"
        bgColor="background.component.primary"
        borderRadius={8}
        px={{ base: 4, md: 10 }}
        py={{ base: 4, md: 5 }}
      >
        <Suspense fallback={<CalendarSkeleton />}>
          <CalendarEvents />
        </Suspense>
      </Box>
    </GridItem>

    <GridItem mt={{ base: 6, '2xl': 0 }}>
      <Suspense fallback={<CardPaymentSkeleton />}>
        <CardPayment />
      </Suspense>
    </GridItem>
  </Grid>
);

export default CalendarSection;
