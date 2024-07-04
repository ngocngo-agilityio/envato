// Libs
import dayjs from 'dayjs';

// Actions
import { getEvents } from '@/lib/actions';

// Components
import CalendarEventsClient from './CalendarEventsClient';

const CalendarEvents = async () => {
  const { events } = await getEvents();

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
