// Libs
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { getMessaging } from 'firebase/messaging';
import { useRouter } from 'next/navigation';

// Sections
import Login from '@/ui/sections/Login';

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

describe('Login Section', () => {
  const mockSignIn = jest.fn();
  const mockPush = jest.fn();

  const submitLoginForm = () => {
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: MOCK_AUTH_FORM_DATA.email },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: MOCK_AUTH_FORM_DATA.password },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    });
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
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
    const { container } = render(<Login />);

    expect(container).toMatchSnapshot();
  });

  test('handles form submission successfully', async () => {
    render(<Login />);

    submitLoginForm();

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith(
        {
          email: MOCK_AUTH_FORM_DATA.email,
          password: MOCK_AUTH_FORM_DATA.password,
          fcmToken: MOCK_TOKEN,
        },
        false,
      ),
    );

    expect(mockPush).toHaveBeenCalledWith(ROUTES.ROOT);
  });

  test('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    (getMessaging as jest.Mock).mockReturnValue(null);
    mockSignIn.mockRejectedValueOnce(new Error(errorMessage));

    render(<Login />);

    submitLoginForm();

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
