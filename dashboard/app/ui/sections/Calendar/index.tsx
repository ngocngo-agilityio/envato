// Libs
import { Suspense } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';

// Components
import { CalendarSkeleton } from '@/ui/components';
import CalendarEvents from './CalendarEvents';
import CardPaymentWithInView from './CardPaymentWithInView';

interface CalendarProps {
  userId: string;
}

const CalendarSection = ({ userId }: CalendarProps) => (
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
          <CalendarEvents userId={userId} />
        </Suspense>
      </Box>
    </GridItem>

    <CardPaymentWithInView />
  </Grid>
);

export default CalendarSection;
