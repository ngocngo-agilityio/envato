// Actions
import { addEvent } from '@/lib/actions';
import { addRecentActivity, mainHttpServiceWithFetch } from '@/lib/services';

// Mocks
import {
  MOCK_ADD_EVENT_PAYLOAD,
  MOCK_ADD_EVENT_SUCCESS_RES,
  MOCK_UPDATE_SUCCESS_RES,
  MOCK_USER_DETAIL,
} from '@/lib/mocks';
import { QUERY_TAGS } from '@/lib/constants';

const mockRevalidateTag = jest.fn();

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: MOCK_USER_DETAIL.id })),
  })),
}));

jest.mock('@/lib/services', () => ({
  addRecentActivity: jest.fn(),
  mainHttpServiceWithFetch: jest.fn(),
}));

describe('Events action', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should add event successfully', async () => {
    jest
      .spyOn(mainHttpServiceWithFetch, 'postRequest')
      .mockResolvedValue(MOCK_ADD_EVENT_SUCCESS_RES);

    (
      addRecentActivity as jest.MockedFunction<typeof addRecentActivity>
    ).mockResolvedValue(MOCK_UPDATE_SUCCESS_RES);

    await addEvent(MOCK_ADD_EVENT_PAYLOAD);

    waitFor(() =>
      expect(mockRevalidateTag).toHaveBeenCalledWith(QUERY_TAGS.EVENTS),
    );
  });
});
