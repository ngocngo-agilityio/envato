// Constants
import { DEFAULT_PAGE, END_POINTS, QUERY_TAGS } from '@/lib/constants';

// Types
import { TEventsResponse } from '@/lib/interfaces';

// Services
import { mainHttpServiceWithFetch } from '@/lib/services';

export const getEvents = async (userId: string) => {
  const endpoint = `${END_POINTS.EVENT}/${userId}/${DEFAULT_PAGE}`;

  const res: TEventsResponse = await mainHttpServiceWithFetch.getRequest({
    endpoint,
    configOptions: { next: { tags: [QUERY_TAGS.EVENTS] } },
  });

  const { result = [], totalPage = 0 } = res || {};

  return { events: result, totalPage };
};
