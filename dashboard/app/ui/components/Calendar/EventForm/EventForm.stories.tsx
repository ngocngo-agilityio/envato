import type { Meta, StoryObj } from '@storybook/react';

// Components
import { EventForm } from '@/ui/components';

const meta: Meta<typeof EventForm> = {
  title: 'Custom Components/Calendar/EventForm',
  tags: ['autodocs'],
  component: EventForm,
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof EventForm>;

export const Default: Story = {
  args: {
    eventName: 'Event 1',
    date: '2024-05-30',
    startTime: '08:30',
    endTime: '09:00',
  },
};
