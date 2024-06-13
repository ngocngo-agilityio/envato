// Libs
import { render } from '@testing-library/react';

// Components
import { PasswordSwitcher } from '@/ui/components';

const mockProps = {
  onClick: jest.fn(),
};

describe('PasswordSwitcher component', () => {
  it('should render match with snapshot', () => {
    const { container } = render(<PasswordSwitcher {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const { container } = render(
      <PasswordSwitcher {...mockProps} isShow={true} />,
    );

    expect(expect(container)).toBeInTheDocument;
  });
});
