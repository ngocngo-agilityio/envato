import type { Meta, StoryObj } from '@storybook/react';

// Components
import Pagination from '.';

const meta: Meta<typeof Pagination> = {
  title: 'Custom Components/Pagination',
  tags: ['autodocs'],
  component: Pagination,
  argTypes: {
    pageSize: {
      description: 'The number of item to display in one page',
    },

    onPageChange: {
      description: 'The function to be called when changing pages',
    },
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    pageSize: 8,
    arrOfCurrButtons: ['1', '2', '3', '...', '7'],
    currentPage: 1,
  },
};
