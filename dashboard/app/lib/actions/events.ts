'use server';

// Libs
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

// Constants
import { END_POINTS, ERROR_MESSAGES, QUERY_TAGS } from '@/lib/constants';

// Types
import {
  AddEventPayload,
  EActivity,
  UpdateEventPayload,
} from '@/lib/interfaces';

// Services
import { addRecentActivity, mainHttpServiceWithFetch } from '@/lib/services';

type ErrorMessage = { title: string; description: string };

export const addEvent = async (
  eventData: AddEventPayload,
): Promise<{ error?: ErrorMessage } | void> => {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value || '';

    await mainHttpServiceWithFetch.postRequest({
      endpoint: END_POINTS.EVENT,
      body: {
        ...eventData,
        userId,
      },
    });

    await addRecentActivity(EActivity.ADD_EVENT, userId);

    revalidateTag(QUERY_TAGS.EVENTS);
  } catch (error) {
    return { error: ERROR_MESSAGES.CREATE_EVENT_FAIL };
  }
};

export const updateEvent = async (
  eventData: UpdateEventPayload,
): Promise<{ error?: ErrorMessage } | void> => {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value || '';

    await mainHttpServiceWithFetch.putRequest({
      endpoint: END_POINTS.EVENT,
      body: {
        ...eventData,
        userId,
      },
    });

    await addRecentActivity(EActivity.UPDATE_EVENT, userId);

    revalidateTag(QUERY_TAGS.EVENTS);
  } catch (error) {
    return { error: ERROR_MESSAGES.UPDATE_EVENT_FAIL };
  }
};
