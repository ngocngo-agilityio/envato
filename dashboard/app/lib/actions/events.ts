import { DEFAULT_PAGE, END_POINTS } from '../constants';
import { TEventsResponse } from '../interfaces';
import { mainHttpService } from '../services';

export const getEvents = async (userId: string) => {
  const res = (
    await mainHttpService.get<TEventsResponse>({
      path: END_POINTS.EVENT,
      userId,
      page: DEFAULT_PAGE,
    })
  ).data;

  const { result = [], totalPage = 0 } = res || {};

  return { events: result, totalPage };
};
