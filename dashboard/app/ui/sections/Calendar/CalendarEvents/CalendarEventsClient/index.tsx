'use client';

// Libs
import { memo, useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { Event } from 'react-big-calendar';

// Hooks
import { useEvents } from '@/lib/hooks';

// Types
import { TEvent } from '@/lib/interfaces';

// Constants
import { ERROR_MESSAGES, STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Utils
import { customToast } from '@/lib/utils';

// Actions
import { updateEvent, addEvent } from '@/lib/actions';

// Components
import { Calendar as CalendarComponent } from '@/ui/components';

interface CalendarProps {
  events: (Event & TEvent & { userId: string })[];
}

const Calendar = ({ events }: CalendarProps): JSX.Element => {
  const toast = useToast();
  const [date, setDate] = useState(new Date());
  const [isMutatingEvents, setIsMutatingEvents] = useState(false);

  // TODO: Update later when refactoring for mutate Event on Server component
  // Events
  const { isDeleteEvent, deleteEvent } = useEvents();

  const isLoading = isMutatingEvents || isDeleteEvent;

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

  const handleDeleteEventSuccess = useCallback(() => {
    toast(
      customToast(
        SUCCESS_MESSAGES.DELETE_EVENT_SUCCESS.title,
        SUCCESS_MESSAGES.DELETE_EVENT_SUCCESS.description,
        STATUS.SUCCESS,
      ),
    );
  }, [toast]);

  const handleDeleteEventError = useCallback(() => {
    toast(
      customToast(
        ERROR_MESSAGES.DELETE_EVENT_FAIL.title,
        ERROR_MESSAGES.DELETE_EVENT_FAIL.description,
        STATUS.ERROR,
      ),
    );
  }, [toast]);

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      const payload = {
        eventId,
      };

      deleteEvent(payload, {
        onSuccess: handleDeleteEventSuccess,
        onError: handleDeleteEventError,
      });
    },
    [deleteEvent, handleDeleteEventError, handleDeleteEventSuccess],
  );

  return (
    <CalendarComponent
      events={events}
      date={date}
      isLoading={isLoading}
      onSetDate={setDate}
      onAddEvent={handleAddEvent}
      onEditEvent={handleUpdateEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  );
};

const CalendarMemorized = memo(Calendar);

export default CalendarMemorized;
