// Libs
import { screen, fireEvent, act } from '@testing-library/react';

// HOCs
import CardBalanceWithBalance from '@/ui/components/CardPayment/CardBalance';

// Utils
import { customToast, renderQueryProviderTest } from '@/lib/utils';

// Mocks
import { USERS_MOCK } from '@/lib/mocks';
import { authStore } from '@/lib/stores';
import { usePinCode } from '@/lib/hooks';
import { SUCCESS_MESSAGES } from '@/lib/constants';

jest.mock('@/lib/stores', () => ({
  authStore: jest.fn(() => USERS_MOCK[0]),
}));

jest.mock('@/lib/hooks', () => ({
  useAuth: jest.fn(() => ({ setUser: jest.fn() })),
  usePinCode: jest.fn(() => ({
    isSetNewPinCode: false,
    isConfirmPinCode: false,
    setNewPinCode: jest.fn(),
    confirmPinCode: jest.fn(),
  })),
  useWallet: jest.fn(() => ({ currentWalletMoney: { balance: 100 } })),
}));

describe('withBalance HOC', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('Should render correctly', () => {
    renderQueryProviderTest(<CardBalanceWithBalance />);

    expect(screen.getByText('******')).toBeInTheDocument();
  });

  it('should open the set pin code modal when click show balance button if user have not Pin code', () => {
    renderQueryProviderTest(<CardBalanceWithBalance />);

    act(() => {
      fireEvent.click(screen.getByTestId('btn-eye'));
    });

    expect(
      screen.getByText('Please set the PIN code to your account'),
    ).toBeInTheDocument();
  });

  it('should submit the set pin code form successfully', async () => {
    (usePinCode as jest.Mock).mockReturnValue({
      isSetNewPinCode: false,
      isConfirmPinCode: false,
      setNewPinCode: jest.fn((_, { onSuccess }) => onSuccess()),
      confirmPinCode: jest.fn(),
    });

    renderQueryProviderTest(<CardBalanceWithBalance />);

    act(() => {
      fireEvent.click(screen.getByTestId('btn-eye'));
    });

    const pinInputFields = screen.getAllByTestId('pin-input');

    act(() => {
      fireEvent.change(pinInputFields[0], { target: { value: '1' } });
      fireEvent.change(pinInputFields[1], { target: { value: '2' } });
      fireEvent.change(pinInputFields[2], { target: { value: '3' } });
      fireEvent.change(pinInputFields[3], { target: { value: '4' } });
    });

    await waitFor(() => expect(screen.getByText('Submit')).toBeEnabled());

    act(() => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() =>
      expect(
        screen.getByText(SUCCESS_MESSAGES.SET_PIN_CODE.title),
      ).toBeInTheDocument(),
    );
  });

  it('should open the confirm pin code modal when click show balance button if user have Pin code', () => {
    (authStore as unknown as jest.Mock).mockReturnValue({
      ...USERS_MOCK[0],
      pinCode: '1234',
    });

    renderQueryProviderTest(<CardBalanceWithBalance />);

    act(() => {
      fireEvent.click(screen.getByTestId('btn-eye'));
    });

    expect(screen.getByText('Please enter your PIN code')).toBeInTheDocument();
  });
});
