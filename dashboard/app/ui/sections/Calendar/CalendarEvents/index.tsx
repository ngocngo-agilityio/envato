// Libs
import { memo } from 'react';
import dayjs from 'dayjs';

// Actions
import { getEvents } from '@/lib/actions';

// Components
import Calendar from './Calendar';

interface CalendarEventsProps {
  userId: string;
}

const CalendarEvents = async ({ userId }: CalendarEventsProps) => {
  const { events } = await getEvents(userId);

  console.log('events', events);

  const formattedEvents = events.map((event) => {
    const { eventName = '', startTime, endTime } = event || {};

    return {
      ...event,
      title: eventName,
      start: dayjs(startTime).toDate(),
      end: dayjs(endTime).toDate(),
    };
  });

  return <Calendar events={formattedEvents} />;
};

const CalendarEventsMemorized = memo(CalendarEvents);

export default CalendarEventsMemorized;
