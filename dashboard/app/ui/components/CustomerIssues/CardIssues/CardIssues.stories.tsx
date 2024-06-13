import { StoryObj, Meta } from '@storybook/react';

// Components
import { CardIssues } from '@/ui/components';

// Mocks
import { ISSUES } from '@/lib/mocks';

const meta: Meta<typeof CardIssues> = {
  title: 'Custom Components/CardIssues',
  tags: ['autodocs'],
  component: CardIssues,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof CardIssues>;

export const Default: Story = {
  args: {
    ...ISSUES,
  },
};
