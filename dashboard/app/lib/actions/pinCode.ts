'use server';

// Constants
import { END_POINTS, ERROR_MESSAGES } from '@/lib/constants';

// Types
import { EActivity, TCustomErrorMessage } from '@/lib/interfaces';

// Services
import { addRecentActivity, mainHttpServiceWithFetch } from '@/lib/services';

export const confirmPinCode = async (
  pinCode: string,
  userId: string,
): Promise<{ error?: TCustomErrorMessage } | void> => {
  try {
    await mainHttpServiceWithFetch.postRequest({
      endpoint: END_POINTS.CONFIRM_PIN,
      body: {
        pinCode,
        userId,
      },
    });

    await addRecentActivity(EActivity.ACTIVE_PIN_CODE, userId);
  } catch (error) {
    return { error: ERROR_MESSAGES.CONFIRM_PIN_CODE };
  }
};

export const setPinCode = async (
  pinCode: string,
  userId: string,
): Promise<{ error?: TCustomErrorMessage } | void> => {
  try {
    await mainHttpServiceWithFetch.postRequest({
      endpoint: END_POINTS.CREATE_PIN,
      body: {
        pinCode,
        userId,
      },
    });

    await addRecentActivity(EActivity.CREATE_PIN_CODE, userId);
  } catch (error) {
    return { error: ERROR_MESSAGES.SET_PIN_CODE };
  }
};
