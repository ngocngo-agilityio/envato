// Libs
import { render } from '@testing-library/react';
import { Navigate, Views } from 'react-big-calendar';

// Components
import { CustomToolBar } from '@/ui/components';

const mockProps = {
  label: 'May',
  view: Views.MONTH,
  onView: jest.fn(),
  onNavigate: jest.fn(),
  localizer: {
    messages: {},
  },
  date: new Date('2023-05-27'),
  views: [Views.MONTH, Views.WEEK, Views.DAY],
};

describe('CustomToolbar component', () => {
  it('CustomToolbar component renders correctly', () => {
    const { container } = render(<CustomToolBar {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('calls the onView when the Week button are clicked', () => {
    const { getByText } = render(
      <CustomToolBar {...mockProps} view={Views.DAY} />,
    );

    fireEvent.click(getByText('Week'));

    expect(mockProps.onView).toHaveBeenCalledWith(Views.WEEK);
  });

  it('calls the onView when the Day button are clicked', () => {
    const { getByText } = render(
      <CustomToolBar {...mockProps} view={Views.MONTH} />,
    );

    fireEvent.click(getByText('Day'));

    expect(mockProps.onView).toHaveBeenCalledWith(Views.DAY);
  });

  it('calls the onView when the Month button are clicked', () => {
    const { getByText } = render(
      <CustomToolBar {...mockProps} view={Views.WEEK} />,
    );

    fireEvent.click(getByText('Month'));

    expect(mockProps.onView).toHaveBeenCalledWith(Views.MONTH);
  });

  it('calls the onNavigate when the Next button are clicked', () => {
    const { getByLabelText } = render(<CustomToolBar {...mockProps} />);

    fireEvent.click(getByLabelText('btn-next'));

    expect(mockProps.onNavigate).toHaveBeenCalledWith(Navigate.NEXT);
  });

  it('calls the onNavigate when the Back button are clicked', () => {
    const { getByLabelText } = render(<CustomToolBar {...mockProps} />);

    fireEvent.click(getByLabelText('btn-back'));

    expect(mockProps.onNavigate).toHaveBeenCalledWith(Navigate.PREVIOUS);
  });
});
