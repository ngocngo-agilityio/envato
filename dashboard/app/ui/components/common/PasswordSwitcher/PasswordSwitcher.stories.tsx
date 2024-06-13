import type { Meta, StoryObj } from '@storybook/react';

// Components
import PasswordSwitcher from '.';

const meta: Meta<typeof PasswordSwitcher> = {
  title: 'Custom Components/PasswordSwitcher',
  tags: ['autodocs'],
  component: PasswordSwitcher,
};

export default meta;
type Story = StoryObj<typeof PasswordSwitcher>;

export const Hidden: Story = {
  args: {
    isShow: false,
  },
};

export const Show: Story = {
  args: {
    isShow: true,
  },
};
