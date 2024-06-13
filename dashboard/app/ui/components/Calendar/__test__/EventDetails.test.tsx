// Components
import { EventDetails } from '@/ui/components';

const mockProps = {
  title: 'Team Scrum',
  time: 'Sunday, May 19 5:30 – 7:30am',
};

const { render } = testLibReactUtils;

describe('EventDetails component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render match with snapshot.', () => {
    const { container } = render(<EventDetails {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('EventDetails component renders correctly', () => {
    const { getByText } = render(<EventDetails {...mockProps} />);

    expect(getByText(mockProps.title)).toBeInTheDocument();
  });
});
