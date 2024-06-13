import type { Meta, StoryObj } from '@storybook/react';

// Components
import { EventDetails } from '@/ui/components';

const meta: Meta<typeof EventDetails> = {
  title: 'Custom Components/Calendar/EventDetails',
  tags: ['autodocs'],
  component: EventDetails,
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof EventDetails>;

export const Default: Story = {
  args: {
    title: 'Team Scrum',
    time: 'Sunday, May 19 5:30 – 7:30am',
  },
};
