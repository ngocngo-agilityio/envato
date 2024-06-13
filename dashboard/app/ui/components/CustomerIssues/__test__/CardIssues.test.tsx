import { render } from '@testing-library/react';

// Components
import { CardIssues } from '@/ui/components';

// Mocks
import { ISSUES } from '@/lib/mocks';

describe('CardIssues render', () => {
  it('Should render match with snapshot.', () => {
    const { container } = render(<CardIssues {...ISSUES} />);
    expect(container).toMatchSnapshot();
  });

  it('displays user information correctly', () => {
    const { getByText } = render(<CardIssues {...ISSUES} />);

    expect(
      getByText(`${ISSUES.firstName} ${ISSUES.lastName}`),
    ).toBeInTheDocument();
  });
});
