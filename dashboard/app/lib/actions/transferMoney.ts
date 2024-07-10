'use server';

// Constants
import { END_POINTS, ERROR_MESSAGES } from '@/lib/constants';

// Types
import { EActivity, TCustomErrorMessage, TAddMoney } from '@/lib/interfaces';

// Services
import { mainHttpServiceWithFetch } from '@/lib/services';

export const sendMoney = async (
  payload: TAddMoney,
): Promise<{ error?: TCustomErrorMessage } | void> => {
  try {
    await mainHttpServiceWithFetch.putRequest({
      endpoint: END_POINTS.SEND_MONEY,
      body: {
        ...payload,
        actionName: EActivity.SEND_MONEY,
      },
    });
  } catch (error) {
    return { error: ERROR_MESSAGES.SEND_MONEY };
  }
};
