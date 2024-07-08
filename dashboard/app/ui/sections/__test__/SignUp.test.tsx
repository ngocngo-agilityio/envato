// Libs
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { getMessaging } from 'firebase/messaging';
import { useRouter } from 'next/navigation';

// Sections
import SignUp from '@/ui/sections/SignUp';

// Hooks
import { useAuth } from '@/lib/hooks';

// Constants
import { ROUTES } from '@/lib/constants';

// Utils
import { requestForToken } from '@/lib/utils';

// Mocks
import { MOCK_AUTH_FORM_DATA, MOCK_TOKEN } from '@/lib/mocks';

jest.mock('@/lib/hooks', () => ({
  ...jest.requireActual('@/lib/hooks'),
  useAuth: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  requestForToken: jest.fn(),
  isWindowDefined: jest.fn(() => true),
  app: jest.fn(),
}));
jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
}));

describe('SignUp Section', () => {
  const mockSignUp = jest.fn();
  const mockPush = jest.fn();

  const submitSignUpForm = () => {
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('First name'), {
        target: { value: MOCK_AUTH_FORM_DATA.firstName },
      });
      fireEvent.change(screen.getByPlaceholderText('Last name'), {
        target: { value: MOCK_AUTH_FORM_DATA.lastName },
      });
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: MOCK_AUTH_FORM_DATA.email },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: MOCK_AUTH_FORM_DATA.password },
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
        target: { value: MOCK_AUTH_FORM_DATA.password },
      });
      fireEvent.click(
        screen.getByText(/By creating an account, you're agreeing to our /i),
      );

      fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    });
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (requestForToken as jest.Mock).mockResolvedValue(MOCK_TOKEN);
    (getMessaging as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should match with snapshot', () => {
    const { container } = render(<SignUp />);

    expect(container).toMatchSnapshot();
  });

  test('handles form submission successfully', async () => {
    render(<SignUp />);

    submitSignUpForm();

    await waitFor(() => expect(mockSignUp).toHaveBeenCalled());

    expect(mockPush).toHaveBeenCalledWith(ROUTES.ROOT);
  });

  test('displays error message on sign up failure', async () => {
    const errorMessage = 'Email already exists';
    (getMessaging as jest.Mock).mockReturnValue(null);
    mockSignUp.mockRejectedValueOnce(new Error(errorMessage));

    render(<SignUp />);

    submitSignUpForm();

    await waitFor(() =>
      expect(screen.getByText(errorMessage)).toBeInTheDocument(),
    );

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: MOCK_AUTH_FORM_DATA.email + '.vn' },
      });
      fireEvent.blur(screen.getByPlaceholderText('Email'));
    });

    waitFor(() => expect(screen.queryByText(errorMessage)).toBeNull());
  });
});
