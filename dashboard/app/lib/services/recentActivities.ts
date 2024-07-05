import axios, { AxiosInstance } from 'axios';

// Services
import { mainHttpServiceWithFetch } from './mainHttpClientWithFetch';

// Constants
import { END_POINTS } from '@/lib/constants';

export const recentActivitiesHttpService: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

export const addRecentActivity = (
  actionName: string,
  userId: string,
): Promise<string> => {
  const body = { actionName, userId };

  return mainHttpServiceWithFetch.postRequest({
    endpoint: END_POINTS.RECENT_ACTIVITIES,
    body,
  });
};
