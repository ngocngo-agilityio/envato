// Constants
import { ERROR_MESSAGES } from '@/lib/constants';

// Mocks
import {
  MOCK_CALENDAR_NOW_DATE,
  MOCK_EVENT_FORM_DATA,
  MOCK_UPDATE_EVENT_FORM,
} from '@/lib/mocks';

// Components
import { EventForm } from '@/ui/components';

const mockProps = {
  ...MOCK_EVENT_FORM_DATA,
  onCancel: jest.fn(),
  onAddEvent: jest.fn(),
  onEditEvent: jest.fn(),
};

const { render } = testLibReactUtils;

describe('EventForm component', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: MOCK_CALENDAR_NOW_DATE });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('EventForm component renders correctly', () => {
    const { container } = render(<EventForm {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('should show the required error messages correctly', async () => {
    const { getByText, getByRole, getByLabelText } = render(
      <EventForm onCancel={mockProps.onCancel} />,
    );

    fireEvent.change(getByLabelText('Title'), {
      target: { value: MOCK_EVENT_FORM_DATA.title },
    });
    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(
        getByText(ERROR_MESSAGES.FIELD_REQUIRED('Date')),
      ).toBeInTheDocument();

      expect(
        getByText(ERROR_MESSAGES.FIELD_REQUIRED('Start time')),
      ).toBeInTheDocument();

      expect(
        getByText(ERROR_MESSAGES.FIELD_REQUIRED('End time')),
      ).toBeInTheDocument();
    });
  });

  it('should show error message if the end time is less than the start time', async () => {
    const { getByText, getByRole, getByLabelText } = render(
      <EventForm {...mockProps} endTime="08:00" />,
    );

    fireEvent.change(getByLabelText('Title'), {
      target: { value: MOCK_UPDATE_EVENT_FORM.title },
    });
    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(getByText(ERROR_MESSAGES.END_TIME_EVENT)).toBeInTheDocument();
    });
  });

  it('should call onAddEvent when submit form without id ', async () => {
    const { getByRole, getByLabelText } = render(<EventForm {...mockProps} />);

    fireEvent.change(getByLabelText('Date'), {
      target: { value: MOCK_UPDATE_EVENT_FORM.date },
    });
    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockProps.onAddEvent).toHaveBeenCalled();
    });
  });

  it('should call onEditEvent when submit form with id ', async () => {
    const { getByRole, getByLabelText } = render(
      <EventForm {...mockProps} id="1" />,
    );

    fireEvent.change(getByLabelText('Date'), {
      target: { value: MOCK_UPDATE_EVENT_FORM.date },
    });
    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockProps.onEditEvent).toHaveBeenCalled();
    });
  });
});
