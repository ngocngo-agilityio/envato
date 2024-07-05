// Libs
import dayjs from 'dayjs';
import { cookies } from 'next/headers';

// Actions
import { getEvents } from '@/lib/services';

// Components
import CalendarEventsClient from './CalendarEventsClient';

const CalendarEvents = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value || '';

  const { events } = await getEvents(userId);

  const formattedEvents = events.map((event) => {
    const { eventName = '', startTime, endTime } = event || {};

    return {
      ...event,
      title: eventName,
      start: dayjs(startTime).toDate(),
      end: dayjs(endTime).toDate(),
    };
  });

  return <CalendarEventsClient events={formattedEvents} />;
};

export default CalendarEvents;
