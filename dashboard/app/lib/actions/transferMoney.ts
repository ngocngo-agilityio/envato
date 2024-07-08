'use server';

// Constants
import { END_POINTS, ERROR_MESSAGES } from '@/lib/constants';

// Types
import { EActivity, TCustomErrorMessage, TAddMoney } from '@/lib/interfaces';

// Services
import { addRecentActivity, mainHttpServiceWithFetch } from '@/lib/services';

export const sendMoney = async (
  payload: TAddMoney,
): Promise<{ error?: TCustomErrorMessage } | void> => {
  try {
    await mainHttpServiceWithFetch.putRequest({
      endpoint: END_POINTS.SEND_MONEY,
      body: payload,
    });

    // Add the recent activity after a delay of 1 second
    // This is done to avoid 503 Service Unavailable errors that may occur when the service is  overloaded
    setTimeout(async () => {
      await addRecentActivity(EActivity.SEND_MONEY, payload.userId);
    }, 5000);
  } catch (error) {
    return { error: ERROR_MESSAGES.SEND_MONEY };
  }
};
