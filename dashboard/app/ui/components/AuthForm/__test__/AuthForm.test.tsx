// Libs
import { render, act, fireEvent } from '@testing-library/react';

// Component
import AuthForm from '@/ui/components/AuthForm';

// Constants
import { ERROR_MESSAGES } from '@/lib/constants';

// Mock
import { MOCK_AUTH_FORM_DATA } from '@/lib/mocks';

describe('AuthForm components', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onResetError: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('match snapshot with login form', () => {
    const { container } = render(<AuthForm {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('should call onSubmit when user submit the Sign up form', async () => {
    const { getByPlaceholderText, getByText, getByRole, getAllByTestId } =
      render(<AuthForm {...mockProps} isRegister={true} />);

    act(() => {
      fireEvent.change(getByPlaceholderText('First name'), {
        target: { value: MOCK_AUTH_FORM_DATA.firstName },
      });
      fireEvent.change(getByPlaceholderText('Last name'), {
        target: { value: MOCK_AUTH_FORM_DATA.lastName },
      });
      fireEvent.change(getByPlaceholderText('Email'), {
        target: { value: MOCK_AUTH_FORM_DATA.email },
      });
      fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: MOCK_AUTH_FORM_DATA.password },
      });
      fireEvent.change(getByPlaceholderText('Confirm password'), {
        target: { value: MOCK_AUTH_FORM_DATA.password + '5' },
      });
      fireEvent.click(
        getByText(/By creating an account, you're agreeing to our /i),
      );

      fireEvent.click(getAllByTestId('eye-icon')[0]);
      fireEvent.click(getAllByTestId('eye-icon')[1]);

      fireEvent.click(getByRole('button', { name: 'Sign Up' }));
    });

    await waitFor(async () => {
      expect(getByText(ERROR_MESSAGES.PASSWORD_NOT_MATCH)).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(getByPlaceholderText('Confirm password'), {
        target: { value: MOCK_AUTH_FORM_DATA.password },
      });

      fireEvent.click(getByRole('button', { name: 'Sign Up' }));
    });

    waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalled();
    });
  });

  it('should call onSubmit when user submit the Login form', () => {
    const { getByPlaceholderText, getByRole, getByText } = render(
      <AuthForm {...mockProps} />,
    );

    act(() => {
      fireEvent.change(getByPlaceholderText('Email'), {
        target: { value: MOCK_AUTH_FORM_DATA.email },
      });
      fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: MOCK_AUTH_FORM_DATA.password },
      });

      fireEvent.click(getByText('Remember me'));

      fireEvent.click(getByRole('button', { name: 'Sign In' }));
    });

    waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalled();
    });
  });
});
