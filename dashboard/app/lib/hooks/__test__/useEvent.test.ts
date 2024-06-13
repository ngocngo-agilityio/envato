import { waitFor, renderHook } from '@testing-library/react';

// Hooks
import { useEvents } from '@/lib/hooks';

// Services
import { mainHttpService } from '@/lib/services';

// Utils
import { queryProviderWrapper } from '@/lib/utils';

// Mocks
import {
  MOCK_ADD_EVENT_PAYLOAD,
  MOCK_ADD_EVENT_SUCCESS_RES,
  MOCK_DELETE_EVENT_PAYLOAD,
  MOCK_EVENTS,
  MOCK_EVENTS_SUCCESS_RES,
  MOCK_UPDATE_EVENT_PAYLOAD,
  MOCK_UPDATE_SUCCESS_RES,
} from '@/lib/mocks';

describe('useEvents', () => {
  beforeEach(() => {
    jest
      .spyOn(mainHttpService, 'get')
      .mockResolvedValue(MOCK_EVENTS_SUCCESS_RES);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch events successfully', async () => {
    const { result } = renderHook(() => useEvents(), {
      wrapper: queryProviderWrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(MOCK_EVENTS));
  });

  it('should add an event successfully', async () => {
    jest
      .spyOn(mainHttpService, 'post')
      .mockResolvedValue(MOCK_ADD_EVENT_SUCCESS_RES);

    const expectedEvents = [MOCK_ADD_EVENT_SUCCESS_RES.data, ...MOCK_EVENTS];

    const { result } = renderHook(() => useEvents(), {
      wrapper: queryProviderWrapper,
    });

    result.current.addEvent(MOCK_ADD_EVENT_PAYLOAD);

    await waitFor(() => expect(result.current.data).toEqual(expectedEvents));
  });

  it('should update event successfully', async () => {
    const expectedEvents = [...MOCK_EVENTS];
    expectedEvents[0] = {
      ...MOCK_EVENTS[0],
      eventName: MOCK_UPDATE_EVENT_PAYLOAD.eventName,
    };

    jest
      .spyOn(mainHttpService, 'put')
      .mockResolvedValue(MOCK_UPDATE_SUCCESS_RES);

    const { result } = renderHook(() => useEvents(), {
      wrapper: queryProviderWrapper,
    });

    result.current.updateEvent(MOCK_UPDATE_EVENT_PAYLOAD);

    await waitFor(() => expect(result.current.data).toEqual(expectedEvents));
  });

  it('should delete event successfully', async () => {
    jest
      .spyOn(mainHttpService, 'delete')
      .mockResolvedValue(MOCK_UPDATE_SUCCESS_RES);

    const { result } = renderHook(() => useEvents(), {
      wrapper: queryProviderWrapper,
    });

    result.current.deleteEvent(MOCK_DELETE_EVENT_PAYLOAD);

    await waitFor(() => expect(result.current.data).toEqual([MOCK_EVENTS[0]]));
  });
});
