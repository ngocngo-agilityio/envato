// Libs
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';

// Constants
import { DEFAULT_PAGE, END_POINTS } from '@/lib/constants';

// Types
import { TEventsResponse } from '@/lib/interfaces';

// Utils
import { prefetch } from '@/lib/utils';

// Sections
import CalendarSection from '@/ui/sections/Calendar';

const Calendar = async () => {
  const queryClient = new QueryClient();
  const cookieStore = cookies();

  const userId = cookieStore.get('userId')?.value;
  const endpoint = `${END_POINTS.EVENT}/${userId}/${DEFAULT_PAGE}`;
  const queryKey = [END_POINTS.EVENT, userId];

  await prefetch<TEventsResponse[]>(endpoint, queryClient, queryKey);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CalendarSection />
    </HydrationBoundary>
  );
};

export default Calendar;
