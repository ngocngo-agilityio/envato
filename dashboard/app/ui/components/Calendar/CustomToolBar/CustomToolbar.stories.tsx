// Libs
import type { Meta, StoryObj } from '@storybook/react';
import { Views } from 'react-big-calendar';

// Components
import CustomToolbar from '../CustomToolBar';

const meta: Meta<typeof CustomToolbar> = {
  title: 'Custom Components/Calendar/CustomToolbar',
  tags: ['autodocs'],
  component: CustomToolbar,
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomToolbar>;

export const Default: Story = {
  args: {
    label: 'May',
    view: Views.MONTH,
  },
};
