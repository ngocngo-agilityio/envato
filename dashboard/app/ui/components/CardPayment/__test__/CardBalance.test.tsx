// Libs
import { screen, fireEvent, act } from '@testing-library/react';

// HOCs
import CardBalance from '../CardBalance';

// Utils
import { formatDecimalNumber, renderQueryProviderTest } from '@/lib/utils';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import { usePinCode } from '@/lib/hooks';

// Constants
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

// Mocks
import { USERS_MOCK } from '@/lib/mocks';

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
  });

  it('Should render correctly', () => {
    renderQueryProviderTest(<CardBalance />);

    expect(screen.getByText('******')).toBeInTheDocument();
  });

  it('should open the set pin code modal when click show balance button if user have not Pin code', () => {
    renderQueryProviderTest(<CardBalance />);

    act(() => {
      fireEvent.click(screen.getByTestId('btn-eye'));
    });

    expect(
      screen.getByText('Please set the PIN code to your account'),
    ).toBeInTheDocument();
  });

  it('should close the set pin code modal when click Cancel button', () => {
    renderQueryProviderTest(<CardBalance />);

    act(() => {
      fireEvent.click(screen.getByTestId('btn-eye'));
    });

    act(() => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    expect(
      screen.queryByText('Please set the PIN code to your account'),
    ).toBeNull();
  });

  it('should submit the set pin code form successfully', async () => {
    (usePinCode as jest.Mock).mockReturnValue({
      isSetNewPinCode: false,
      isConfirmPinCode: false,
      setNewPinCode: jest.fn((_, { onSuccess }) => onSuccess()),
      confirmPinCode: jest.fn(),
    });

    renderQueryProviderTest(<CardBalance />);

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

    waitFor(() =>
      expect(
        screen.getByText(SUCCESS_MESSAGES.SET_PIN_CODE.title),
      ).toBeInTheDocument(),
    );
  });

  it('should submit the set pin code form failed', async () => {
    (usePinCode as jest.Mock).mockReturnValue({
      isSetNewPinCode: false,
      isConfirmPinCode: false,
      setNewPinCode: jest.fn((_, { onError }) => onError()),
      confirmPinCode: jest.fn(),
    });

    renderQueryProviderTest(<CardBalance />);

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

    waitFor(() =>
      expect(
        screen.getByText(ERROR_MESSAGES.SET_PIN_CODE.title),
      ).toBeInTheDocument(),
    );
  });

  it('should open the confirm pin code modal when click show balance button if user have Pin code', () => {
    (authStore as unknown as jest.Mock).mockReturnValue({
      ...USERS_MOCK[0],
      pinCode: '1234',
    });

    renderQueryProviderTest(<CardBalance />);

    act(() => {
      fireEvent.click(screen.getByTestId('btn-eye'));
    });

    expect(screen.getByText('Please enter your PIN code')).toBeInTheDocument();
  });

  it('should submit the confirm pin code form successfully', async () => {
    (authStore as unknown as jest.Mock).mockReturnValue({
      ...USERS_MOCK[0],
      pinCode: '1234',
    });

    (usePinCode as jest.Mock).mockReturnValue({
      isSetNewPinCode: false,
      isConfirmPinCode: false,
      setNewPinCode: jest.fn(),
      confirmPinCode: jest.fn((_, { onSuccess }) => onSuccess()),
    });

    renderQueryProviderTest(<CardBalance />);

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

    await waitFor(() => {
      expect(
        screen.getByText(SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title),
      ).toBeInTheDocument(),
        expect(
          screen.getByText(`$${formatDecimalNumber(100)}`),
        ).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('btn-eye'));
    });

    waitFor(() =>
      expect(screen.queryByText(`$${formatDecimalNumber(100)}`)).toBeNull(),
    );
  });

  it('should submit the confirm pin code form failed', async () => {
    (authStore as unknown as jest.Mock).mockReturnValue({
      ...USERS_MOCK[0],
      pinCode: '1234',
    });

    (usePinCode as jest.Mock).mockReturnValue({
      isSetNewPinCode: false,
      isConfirmPinCode: false,
      setNewPinCode: jest.fn(),
      confirmPinCode: jest.fn((_, { onError }) => onError()),
    });

    renderQueryProviderTest(<CardBalance />);

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

    waitFor(() =>
      expect(
        screen.getByText(ERROR_MESSAGES.CONFIRM_PIN_CODE.title),
      ).toBeInTheDocument(),
    );
  });
});
