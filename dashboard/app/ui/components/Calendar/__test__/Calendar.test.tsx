// Components
import { Calendar } from '@/ui/components';

// Utils
import { getCurrentDisplayDate, getNextMonth } from '@/lib/utils';

// Mocks
import { MOCK_CALENDAR_NOW_DATE, MOCK_FORMATTED_EVENTS } from '@/lib/mocks';

const mockProps = {
  events: MOCK_FORMATTED_EVENTS,
  onDeleteEvent: jest.fn(),
  onAddEvent: jest.fn(),
  onEditEvent: jest.fn(),
  onSetDate: jest.fn(),
};

const { render } = testLibReactUtils;

describe('Calendar component', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: MOCK_CALENDAR_NOW_DATE });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('Should render match with snapshot.', () => {
    const { container } = render(<Calendar {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('Calendar component renders correctly', () => {
    const { getByText } = render(<Calendar {...mockProps} />);

    expect(getByText('Event 1')).toBeInTheDocument();
  });

  it('should close the event details modal when clicks the close button on that modal', async () => {
    const { getByText, queryByText, getByTestId } = render(
      <Calendar {...mockProps} />,
    );

    act(() => {
      fireEvent.click(getByText('Event 1'));
    });

    await waitFor(() => {
      expect(getByText('Event Details')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(getByTestId('close-icon'));
    });

    await waitFor(() => {
      expect(queryByText('Event Details')).toBeNull();
    });
  });

  it('should open the update event modal when clicks the edit button', async () => {
    const { getByText, getByTestId } = render(<Calendar {...mockProps} />);

    act(() => {
      fireEvent.click(getByText('Event 1'));
    });

    await waitFor(() => {
      expect(getByText('Event Details')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(getByTestId('edit-icon'));
    });

    waitFor(() => {
      expect(getByText('Update Event')).toBeInTheDocument();
    });
  });

  it('should navigate to the next month when click Next button', async () => {
    const { getByText, getByLabelText } = render(<Calendar {...mockProps} />);

    fireEvent.click(getByLabelText('btn-next'));

    expect(getByText(getNextMonth())).toBeInTheDocument();
  });

  it('should view Day when click Day button', async () => {
    const { getByText, getByRole } = render(<Calendar {...mockProps} />);

    fireEvent.click(getByRole('button', { name: 'Day' }));

    expect(getByText(getCurrentDisplayDate())).toBeInTheDocument();
  });

  it('should call onDeleteEvent when click Delete button', async () => {
    const { getByText, getByTestId } = render(<Calendar {...mockProps} />);

    act(() => {
      fireEvent.click(getByText('Event 1'));
    });

    await waitFor(() => {
      expect(getByText('Event Details')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(getByTestId('delete-icon'));
    });

    await waitFor(() => {
      const deleteButton = getByText('Delete');
      expect(deleteButton).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(getByText('Delete'));
    });

    expect(mockProps.onDeleteEvent).toHaveBeenCalled();
  });
});
