// Constants
import { END_POINTS, QUERY_TAGS } from '@/lib/constants';

// Services
import { mainHttpServiceWithFetch } from '@/lib/services';

// Types
import { TUserDetail } from '../interfaces';

export type UsersResponse = Array<
  Omit<TUserDetail, 'id'> & {
    _id: string;
  }
>;

export const getUserList = async (userId: string) => {
  const endpoint = `${END_POINTS.USERS}/${userId}`;

  const data: UsersResponse = await mainHttpServiceWithFetch.getRequest({
    endpoint,
    configOptions: { next: { tags: [QUERY_TAGS.USERS] } },
  });

  return { data: data || [] };
};
