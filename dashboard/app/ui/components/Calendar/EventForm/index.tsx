'use client';

// Libs
import { memo, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Flex, VStack } from '@chakra-ui/react';

// Interfaces
import { TEvent } from '@/lib/interfaces';

// Constants
import { EVENT_SCHEMA, ERROR_MESSAGES } from '@/lib/constants';

// Components
import InputField from '@/ui/components/common/InputField';

export interface TEventForm extends TEvent {
  date: string;
}

interface EventFormProps {
  id?: string;
  eventName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  onCancel: () => void;
  onAddEvent?: (data: Omit<TEvent, '_id'>) => void;
  onEditEvent?: (data: TEvent) => void;
}

const EventForm = ({
  id = '',
  eventName = '',
  date = '',
  startTime = '',
  endTime = '',
  onCancel,
  onAddEvent,
  onEditEvent,
}: EventFormProps) => {
  const {
    control,
    clearErrors,
    handleSubmit,
    watch,
    formState: { isDirty },
    reset,
  } = useForm<TEventForm>({
    defaultValues: {
      _id: id,
      eventName: eventName,
      startTime: startTime,
      endTime: endTime,
      date: date,
    },
  });

  const endTimeValidationRule = {
    ...EVENT_SCHEMA.END_TIME,
    validate: (endTime: string) => {
      const startTime = watch('startTime');

      return startTime && endTime <= startTime
        ? ERROR_MESSAGES.END_TIME_EVENT
        : true;
    },
  };

  const handleChangeValue = useCallback(
    <T,>(field: keyof TEventForm, changeHandler: (value: T) => void) =>
      (data: T) => {
        clearErrors(field);
        changeHandler(data);
      },
    [clearErrors],
  );

  const handleSubmitForm = useCallback(
    (data: TEventForm) => {
      const requestData = {
        _id: data._id,
        eventName: data.eventName,
        startTime: `${data.date} ${data.startTime}`,
        endTime: `${data.date} ${data.endTime}`,
      };

      !data._id
        ? onAddEvent && onAddEvent(requestData)
        : onEditEvent && onEditEvent(requestData);

      reset(requestData);
      onCancel();
    },
    [onAddEvent, onCancel, onEditEvent, reset],
  );

  return (
    <VStack as="form" onSubmit={handleSubmit(handleSubmitForm)}>
      <Flex w="100%" minW={{ md: 500 }} mb={5}>
        <Controller
          control={control}
          name="eventName"
          rules={EVENT_SCHEMA.TITLE}
          render={({ field: { onChange, ...rest }, fieldState: { error } }) => (
            <InputField
              {...rest}
              label="Title"
              variant="authentication"
              bg="background.body.primary"
              isError={!!error}
              errorMessages={error?.message}
              onChange={handleChangeValue('eventName', onChange)}
            />
          )}
        />
      </Flex>

      <Flex w="100%" mb={5}>
        <Controller
          control={control}
          name="date"
          rules={EVENT_SCHEMA.DATE(!!id)}
          render={({ field: { onChange, ...rest }, fieldState: { error } }) => (
            <InputField
              {...rest}
              label="Date"
              type="date"
              variant="authentication"
              bg="background.body.primary"
              isError={!!error}
              errorMessages={error?.message}
              onChange={handleChangeValue('date', onChange)}
            />
          )}
        />
      </Flex>

      <Flex w="100%" flexDirection={{ base: 'column', md: 'row' }}>
        <Flex w="100%" mb={5}>
          <Controller
            control={control}
            name="startTime"
            rules={EVENT_SCHEMA.START_TIME}
            render={({
              field: { onChange, ...rest },
              fieldState: { error },
            }) => (
              <InputField
                {...rest}
                label="Start time"
                type="time"
                variant="authentication"
                bg="background.body.primary"
                mr={{ md: 2 }}
                isError={!!error}
                errorMessages={error?.message}
                onChange={handleChangeValue('startTime', onChange)}
              />
            )}
          />
        </Flex>
        <Flex w="100%" mb={5}>
          <Controller
            control={control}
            name="endTime"
            rules={endTimeValidationRule}
            render={({
              field: { onChange, ...rest },
              fieldState: { error },
            }) => (
              <InputField
                label="End time"
                type="time"
                variant="authentication"
                bg="background.body.primary"
                {...rest}
                isError={!!error}
                errorMessages={error?.message}
                onChange={handleChangeValue('endTime', onChange)}
              />
            )}
          />
        </Flex>
      </Flex>

      <Flex
        w="100%"
        my={4}
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        wrap="wrap"
        gap={3}
      >
        <Button
          type="submit"
          bg="green.600"
          w={{ md: 240 }}
          isDisabled={!isDirty}
        >
          Save
        </Button>
        <Button
          bg="orange.300"
          w={{ md: 240 }}
          _hover={{ bg: 'orange.400' }}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Flex>
    </VStack>
  );
};

const EventFormMemorized = memo(EventForm);
export default EventFormMemorized;
