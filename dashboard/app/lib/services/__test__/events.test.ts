// Services
import { getEvents, mainHttpServiceWithFetch } from '@/lib/services';

// Mocks
import { MOCK_USER_DETAIL, MOCK_EVENTS_SUCCESS_RES } from '@/lib/mocks';

describe('Events service', () => {
  it('should fetch events successfully', async () => {
    jest
      .spyOn(mainHttpServiceWithFetch, 'getRequest')
      .mockResolvedValue(MOCK_EVENTS_SUCCESS_RES);

    const res = await getEvents(MOCK_USER_DETAIL.id);

    waitFor(() => {
      expect(res.events).toEqual(MOCK_EVENTS_SUCCESS_RES.data.result);
      expect(res.totalPage).toEqual(MOCK_EVENTS_SUCCESS_RES.data.totalPage);
    });
  });

  it('should fetch events with returned null value', async () => {
    jest.spyOn(mainHttpServiceWithFetch, 'getRequest').mockResolvedValue(null);

    const res = await getEvents(MOCK_USER_DETAIL.id);

    waitFor(() => {
      expect(res.events).toEqual([]);
      expect(res.totalPage).toEqual(0);
    });
  });
});
