// Libs
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { Event } from 'react-big-calendar';
import dayjs from 'dayjs';

// Types
import {
  AddEventPayload,
  DeleteEventPayload,
  TEvent,
  UpdateEventPayload,
} from '@/lib/interfaces';

export const MOCK_EVENTS: TEvent[] = [
  {
    _id: '664576b910c4c653733941c1',
    eventName: 'Event 1',
    startTime: '2024-05-16 01:30',
    endTime: '2024-05-16 05:30',
  },
  {
    _id: '664576b910c4c653733941c2',
    eventName: 'Event 2',
    startTime: '2024-05-15 13:30',
    endTime: '2024-05-15 14:00',
  },
];

export const MOCK_EVENTS_SUCCESS_RES: AxiosResponse = {
  data: { result: MOCK_EVENTS, totalPage: 3 },
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {
    headers: {} as AxiosRequestHeaders,
  },
};

export const MOCK_ADD_EVENT_PAYLOAD: AddEventPayload = {
  eventName: 'Event 3',
  startTime: '2024-05-20 01:30',
  endTime: '2024-05-20 05:30',
};

export const MOCK_ADD_EVENT_SUCCESS_RES: AxiosResponse<
  TEvent & { userId: string }
> = {
  data: {
    ...MOCK_ADD_EVENT_PAYLOAD,
    _id: '664576b910c4c653733941c3',
    userId: '6593beacff649fc6c4d2964c',
  },
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {
    headers: {} as AxiosRequestHeaders,
  },
};

export const MOCK_UPDATE_EVENT_PAYLOAD: UpdateEventPayload = {
  eventId: MOCK_EVENTS[0]._id,
  eventName: 'Event 1 Update',
  startTime: MOCK_EVENTS[0].startTime,
  endTime: MOCK_EVENTS[0].endTime,
};

export const MOCK_DELETE_EVENT_PAYLOAD: DeleteEventPayload = {
  eventId: MOCK_EVENTS[1]._id,
};

export const MOCK_FORMATTED_EVENTS: (Event & Pick<TEvent, '_id'>)[] = [
  {
    _id: '664576b910c4c653733941c1',
    title: 'Event 1',
    start: dayjs('2024-05-16 14:30').toDate(),
    end: dayjs('2024-05-16 15:30').toDate(),
  },
  {
    _id: '664576b910c4c653733941c2',
    title: 'Event 2',
    start: dayjs('2024-05-25 10:30').toDate(),
    end: dayjs('2024-05-25 11:30').toDate(),
  },
];

export const MOCK_EVENT_FORM_DATA = {
  title: 'Event 1',
  date: '2024-05-27',
  startTime: '10:00',
  endTime: '11:00',
};

export const MOCK_UPDATE_EVENT_FORM = {
  title: 'Update title',
  date: '2024-05-28',
};

export const MOCK_CALENDAR_NOW_DATE = new Date('2024-05-01');
