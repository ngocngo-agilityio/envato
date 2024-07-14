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
  TCustomErrorMessage,
} from '@/lib/interfaces';

// Services
import { addRecentActivity, mainHttpServiceWithFetch } from '@/lib/services';

export const addEvent = async (
  eventData: AddEventPayload,
): Promise<{ error?: TCustomErrorMessage } | void> => {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value || '';

    console.log('1111111111');

    await mainHttpServiceWithFetch.postRequest({
      endpoint: END_POINTS.EVENT,
      body: {
        ...eventData,
        userId,
      },
    });

    await addRecentActivity(EActivity.ADD_EVENT, userId);

    console.log('2222222222222');

    revalidateTag(QUERY_TAGS.EVENTS);
  } catch (error) {
    return { error: ERROR_MESSAGES.CREATE_EVENT_FAIL };
  }
};

export const updateEvent = async (
  eventData: UpdateEventPayload,
): Promise<{ error?: TCustomErrorMessage } | void> => {
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

export const deleteEvent = async (
  eventId: string,
): Promise<{ error?: TCustomErrorMessage } | void> => {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value || '';

    await mainHttpServiceWithFetch.deleteRequest({
      endpoint: END_POINTS.EVENT,
      body: {
        eventId,
        userId,
      },
    });

    await addRecentActivity(EActivity.DELETE_EVENT, userId);

    revalidateTag(QUERY_TAGS.EVENTS);
  } catch (error) {
    return { error: ERROR_MESSAGES.DELETE_EVENT_FAIL };
  }
};
