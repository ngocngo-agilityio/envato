// Libs
import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';

// Constants
import { DEFAULT_PAGE, END_POINTS, QUERY_TAGS } from '@/lib/constants';

// Types
import { TEventsResponse } from '@/lib/interfaces';

// Services
import { mainHttpService } from '@/lib/services';

export const getEvents = unstable_cache(async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value || '';

  const res = await mainHttpService.get<TEventsResponse>({
    path: END_POINTS.EVENT,
    userId,
    page: DEFAULT_PAGE,
  });

  const { data } = res || {};
  const { result = [], totalPage = 0 } = data || {};

  return { events: result, totalPage };
}, [QUERY_TAGS.EVENTS]);
