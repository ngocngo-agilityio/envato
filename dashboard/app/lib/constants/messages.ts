export const ERROR_MESSAGES = {
  FIELD_REQUIRED: (fieldName: string) => `${fieldName} is required`,
  EMAIL_INVALID: 'Email is invalid',
  PASSWORD_NOT_MATCH: 'Password does not match',
  SOMETHING_ERROR: 'Something went wrong!!',
  AUTH_INCORRECT: 'Email or password is incorrect',
  ACCOUNT_ALREADY_EXISTS: 'This email address is already in used',
  EMPTY_DATA: 'No data found',
  PASS_WORD_SHORT: 'Password must be more than 8 characters',
  PASS_WORD_WEAK:
    'Password contains uppercase, lowercase and special characters',
  PHONE_NUMBER_INVALID: 'Phone number is invalid',
  UPDATE_FAIL: {
    title: 'Update failed',
    description: 'Your profile has not been updated successfully',
  },
  UPLOAD_IMAGE: 'Wrong image format. Only "jpg", "png" and "webp" are allowed',
  UPLOAD_IMAGE_ITEM: 'Can only upload a maximum of 5 images',
  UPLOAD_IMAGE_SIZE: 'Image size should be less than 5MB',
  FACEBOOK_INVALID: 'Facebook link is invalid',
  TWITTER_INVALID: 'Twitter link is invalid',
  LINKEDIN_INVALID: 'Linkedin link is invalid',
  YOUTUBE_INVALID: 'Youtube link is invalid',
  ZIP_CODE_INVALID: 'Zip code must contain 5 numbers',
  AMOUNT_INVALID: 'Price is invalid',
  LIMIT_AMOUNT: 'Price cannot exceed 1 million dollars',
  LIMIT_QUANTITY: 'Quantity must not exceed 1 million',
  QUANTITY_INVALID: 'Quantity is invalid',
  INVALID_TRANSFER_AMOUNT: 'Amount is invalid',
  LIMIT_TRANSFER_AMOUNT: 'Amount cannot exceed $999,999',
  END_TIME_EVENT: 'Event must end after it starts',
  MIN_DATE: 'Date must be today or later',
  SET_PIN_CODE: {
    title: 'Set PIN code failed',
    description:
      'Something went wrong when setting your PIN code. Please check your network connection and try again',
  },
  CONFIRM_PIN_CODE: {
    title: 'Confirm PIN code failed',
    description: 'Your PIN code was invalid',
  },
  DEFAULT_ERROR: 'An error has occurred',
  DELETE_FAIL: {
    title: 'Delete failed',
    description: 'Transactions has not been delete successfully',
  },
  UPDATE_TRANSACTION_FAIL: {
    title: 'Update failed',
    description: 'Your transaction has not been updated successfully',
  },
  CREATE_TRANSACTION_FAIL: {
    title: 'Create failed',
    description: 'Your transaction has not been create successfully',
  },
  UPDATE_PRODUCT_FAIL: {
    title: 'Update failed',
    description: 'Your product has not been updated successfully',
  },
  UPDATE_PASSWORD_FAIL: 'Old password is not correct',
  DELETE_NOTIFICATION: {
    title: 'Delete failed',
    description: 'Notification has not been delete successfully',
  },
  ADD_MONEY: {
    title: 'Add money failed',
    description: 'An error has occurred when adding money to your account',
  },
  CREATE_ISSUES_FAIL: {
    title: 'Create issues failed',
    description: 'Issues has not been add successfully',
  },
  SEND_MONEY: {
    title: 'Send money failed',
    description:
      'An error has occurred when sending money. Please check your total balance and try again',
  },
  OLD_PASSWORD_INCORRECT: 'Old password is not correct',
  LOCK_USER_FAIL: {
    title: 'Lock failed',
    description: 'User has not been locked successfully',
  },
  UNLOCK_USER_FAIL: {
    title: 'Unlock failed',
    description: 'User has not been unlocked successfully',
  },
  FORGOT_PASSWORD: {
    title: 'Recover password failed',
    description: 'An error has occurred when checking your email address',
  },
  LAST_MESSAGES_FAIL: {
    title: 'Get last messages failed',
    description: 'An error occurred while getting last messages',
  },
  SELECT_MEMBER_CHAT: {
    title: 'Select member chat failed',
    description: 'An error occurred while selecting member chat',
  },
  CREATE_PRODUCT_FAIL: {
    title: 'Create failed',
    description: 'Your product has not been created successfully',
  },
  DELETE_PRODUCT_FAIL: {
    title: 'Delete failed',
    description: 'Your product been deleted failed',
  },
  CREATE_EVENT_FAIL: {
    title: 'Create failed',
    description: 'Your event has been created failed',
  },
  UPDATE_EVENT_FAIL: {
    title: 'Update failed',
    description: 'Your event has been updated failed',
  },
  DELETE_EVENT_FAIL: {
    title: 'Delete failed',
    description: 'Your event has been deleted failed',
  },
};

export const SUCCESS_MESSAGES = {
  UPDATE_SUCCESS: {
    title: 'Update success',
    description: 'Your profile has been updated successfully',
  },
  SET_PIN_CODE: {
    title: 'Set PIN code successfully',
    description: 'Your PIN code has been set successfully',
  },
  CONFIRM_PIN_CODE: {
    title: 'Confirm PIN code successfully',
    description: 'Your PIN code is verified',
  },
  DELETE_SUCCESS: {
    title: 'Delete success',
    description: 'Transactions has been delete successfully',
  },
  DELETE_PRODUCT_SUCCESS: {
    title: 'Delete success',
    description: 'Products has been delete successfully',
  },
  UPDATE_TRANSACTION_SUCCESS: {
    title: 'Update success',
    description: 'Your transaction has been updated successfully',
  },
  UPDATE_PRODUCT_SUCCESS: {
    title: 'Update success',
    description: 'Your product has been updated successfully',
  },
  DELETE_NOTIFICATION_SUCCESS: {
    title: 'Delete success',
    description: 'Notification has been delete successfully',
  },
  ADD_MONEY: {
    title: 'Add money successfully',
    description: 'Your money has been added to your account',
  },
  CREATE_ISSUES: {
    title: 'Create issues successfully',
    description: 'Your issues has been added',
  },
  SEND_MONEY: {
    title: 'Send money successfully',
    description: 'Your money has been sent to the transfer account',
  },
  LOCK_USER_SUCCESS: {
    title: 'Lock success',
    description: 'User has been locked successfully',
  },
  UNLOCK_USER_SUCCESS: {
    title: 'Unlock success',
    description: 'User has been unlocked successfully',
  },
  FORGOT_PASSWORD: {
    title: 'Recover password successfully',
    description: 'Check your email inbox to recover your password',
  },
  CREATE_PRODUCT_SUCCESS: {
    title: 'Created success',
    description: 'Your product has been created successfully',
  },
  CREATE_EVENT_SUCCESS: {
    title: 'Created success',
    description: 'Your event has been created successfully',
  },
  UPDATE_EVENT_SUCCESS: {
    title: 'Update success',
    description: 'Your event has been updated successfully',
  },
  DELETE_EVENT_SUCCESS: {
    title: 'Delete success',
    description: 'Your event has been deleted successfully',
  },
};

export const CONFIRM_MESSAGE = {
  DELETE_NOTIFICATION: 'Are you sure delete the notification?',
};

export const COMMON_MESSAGES = {
  EMPTY_ARRAY: 'No items found!',
};
