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
    await mainHttpServiceWithFetch.postRequest({
      endpoint: END_POINTS.SEND_MONEY,
      body: {
        ...payload,
      },
    });

    await addRecentActivity(EActivity.SEND_MONEY, payload.userId);
  } catch (error) {
    return { error: ERROR_MESSAGES.SEND_MONEY };
  }
};
