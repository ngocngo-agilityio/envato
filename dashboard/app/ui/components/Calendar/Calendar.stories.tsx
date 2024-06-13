import type { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';

// Components
import { Calendar } from '@/ui/components';

const meta: Meta<typeof Calendar> = {
  title: 'Custom Components/Calendar',
  tags: ['autodocs'],
  component: Calendar,
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    events: [
      {
        _id: '664576b910c4c653733941c2',
        start: dayjs('2024-05-16 01:30').toDate(),
        end: dayjs('2024-05-16 05:30').toDate(),
        title: 'Event 1',
      },
    ],
  },
};
