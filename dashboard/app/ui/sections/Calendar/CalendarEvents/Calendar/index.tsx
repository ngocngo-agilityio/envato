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

// Components
import { Calendar as CalendarComponent } from '@/ui/components';

interface CalendarProps {
  events: (Event & TEvent & { userId: string })[];
}

// TODO: Update later when refactoring for fetching Events on Server component
const Calendar = ({ events }: CalendarProps): JSX.Element => {
  const toast = useToast();
  const [date, setDate] = useState(new Date());

  // Events
  const {
    // data: events = [],
    // isLoading: isLoadingEvents,
    isAddEvent,
    addEvent,
    isUpdateEvent,
    updateEvent,
    isDeleteEvent,
    deleteEvent,
  } = useEvents();

  const isLoading = isAddEvent || isUpdateEvent || isDeleteEvent;

  // const formattedEvents = useMemo(
  //   () =>
  //     events.map((event) => {
  //       const { eventName = '', startTime, endTime } = event || {};

  //       return {
  //         ...event,
  //         title: eventName,
  //         start: dayjs(startTime).toDate(),
  //         end: dayjs(endTime).toDate(),
  //       };
  //     }),
  //   [events],
  // );

  const handleAddEventSuccess = useCallback(
    (eventDate: Date) => {
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

  const handleAddEventError = useCallback(() => {
    toast(
      customToast(
        ERROR_MESSAGES.CREATE_EVENT_FAIL.title,
        ERROR_MESSAGES.CREATE_EVENT_FAIL.description,
        STATUS.ERROR,
      ),
    );
  }, [toast]);

  const handleAddEvent = useCallback(
    (data: Omit<TEvent, '_id'>) => {
      const { startTime } = data;
      const eventDate = new Date(startTime);

      addEvent(data, {
        onSuccess: () => handleAddEventSuccess(eventDate),
        onError: handleAddEventError,
      });
    },
    [addEvent, handleAddEventError, handleAddEventSuccess],
  );

  const handleUpdateEventSuccess = useCallback(
    (eventDate: Date) => {
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

  const handleUpdateEventError = useCallback(() => {
    toast(
      customToast(
        ERROR_MESSAGES.UPDATE_EVENT_FAIL.title,
        ERROR_MESSAGES.UPDATE_EVENT_FAIL.description,
        STATUS.ERROR,
      ),
    );
  }, [toast]);

  const handleUpdateEvent = useCallback(
    (data: TEvent) => {
      const { startTime } = data;
      const eventDate = new Date(startTime);

      const payload = {
        ...data,
        eventId: data._id,
      };

      updateEvent(payload, {
        onSuccess: () => handleUpdateEventSuccess(eventDate),
        onError: handleUpdateEventError,
      });
    },
    [handleUpdateEventError, handleUpdateEventSuccess, updateEvent],
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
