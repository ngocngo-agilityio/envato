'use client';

// Libs
import { memo, useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { Event } from 'react-big-calendar';

// Types
import { TEvent } from '@/lib/interfaces';

// Constants
import { STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Utils
import { customToast } from '@/lib/utils';

// Actions
import { updateEvent, addEvent, deleteEvent } from '@/lib/actions';

// Components
import { Calendar as CalendarComponent } from '@/ui/components';

interface CalendarProps {
  events: (Event & TEvent & { userId: string })[];
}

const Calendar = ({ events }: CalendarProps): JSX.Element => {
  const toast = useToast();
  const [date, setDate] = useState(new Date());
  const [isMutatingEvents, setIsMutatingEvents] = useState(false);

  const handleAddEvent = useCallback(
    async (data: Omit<TEvent, '_id'>) => {
      setIsMutatingEvents(true);
      const { startTime } = data;
      const eventDate = new Date(startTime);

      const res = await addEvent(data);

      const { error } = res || {};
      setIsMutatingEvents(false);

      if (error) {
        toast(customToast(error.title, error.description, STATUS.ERROR));

        return;
      }

      setDate(eventDate);
      toast(
        customToast(
          SUCCESS_MESSAGES.CREATE_EVENT_SUCCESS.title,
          SUCCESS_MESSAGES.CREATE_EVENT_SUCCESS.description,
          STATUS.SUCCESS,
        ),
      );
    },
    [toast],
  );

  const handleUpdateEvent = useCallback(
    async (data: TEvent) => {
      setIsMutatingEvents(true);
      const { startTime } = data;
      const eventDate = new Date(startTime);

      const payload = {
        ...data,
        eventId: data._id,
      };

      const res = await updateEvent(payload);
      const { error } = res || {};
      setIsMutatingEvents(false);

      if (error) {
        toast(customToast(error.title, error.description, STATUS.ERROR));

        return;
      }

      setDate(eventDate);
      toast(
        customToast(
          SUCCESS_MESSAGES.UPDATE_EVENT_SUCCESS.title,
          SUCCESS_MESSAGES.UPDATE_EVENT_SUCCESS.description,
          STATUS.SUCCESS,
        ),
      );
    },

    [toast],
  );

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      setIsMutatingEvents(true);

      const res = await deleteEvent(eventId);

      const { error } = res || {};
      setIsMutatingEvents(false);

      if (error) {
        toast(customToast(error.title, error.description, STATUS.ERROR));

        return;
      }

      toast(
        customToast(
          SUCCESS_MESSAGES.DELETE_EVENT_SUCCESS.title,
          SUCCESS_MESSAGES.DELETE_EVENT_SUCCESS.description,
          STATUS.SUCCESS,
        ),
      );
    },
    [toast],
  );

  return (
    <CalendarComponent
      events={events}
      date={date}
      isLoading={isMutatingEvents}
      onSetDate={setDate}
      onAddEvent={handleAddEvent}
      onEditEvent={handleUpdateEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  );
};

const CalendarMemorized = memo(Calendar);

export default CalendarMemorized;
