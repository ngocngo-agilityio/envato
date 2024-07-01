// Libs
import { fireEvent } from '@testing-library/react';

// Utils
import { renderQueryProviderTest } from '@/lib/utils';

// Mocks
import { MOCK_FILTER_DATA_USERS, USERS_MOCK } from '@/lib/mocks';

// Components
import CardPaymentWithPinCode from '..';

// Hooks
import { useGetUserDetails, useMoney, usePinCode } from '@/lib/hooks';

// Stores
import { authStore } from '@/lib/stores';

// Constants
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

jest.mock('@/lib/stores', () => ({
  authStore: jest.fn(() => ({ ...USERS_MOCK[0] })),
}));

jest.mock('@/lib/hooks', () => ({
  ...jest.requireActual('@/lib/hooks'),
  useAuth: jest.fn(() => ({ setUser: jest.fn() })),
  usePinCode: jest.fn(() => ({
    isSetNewPinCode: false,
    isConfirmPinCode: false,
    setNewPinCode: jest.fn(),
    confirmPinCode: jest.fn(),
  })),
  useWallet: jest.fn(() => ({ currentWalletMoney: { balance: 100 } })),
  useGetUserDetails: jest.fn(() => ({
    filterDataUser: MOCK_FILTER_DATA_USERS,
  })),
  useMoney: jest.fn(() => ({
    sendMoneyToUserWallet: jest.fn(),
    isSendMoneySubmitting: false,
  })),
}));

describe('CardPayment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match with snapshot', () => {
    (useGetUserDetails as jest.Mock).mockReturnValueOnce({
      filterDataUser: undefined,
    });

    const { container } = renderQueryProviderTest(<CardPaymentWithPinCode />);

    expect(container).toMatchSnapshot();
  });

  it('should Send Money successfully', async () => {
    (authStore as unknown as jest.Mock).mockReturnValue({
      ...USERS_MOCK[0],
      bonusTimes: 10,
      pinCode: '1234',
    });

    (usePinCode as jest.Mock).mockReturnValue({
      confirmPinCode: jest.fn((_, { onSuccess }) => onSuccess()),
      setNewPinCode: jest.fn(),
    });

    (useMoney as jest.Mock).mockReturnValue({
      sendMoneyToUserWallet: jest.fn((_, { onSuccess }) => onSuccess()),
      isSendMoneySubmitting: false,
    });

    const { getByText, getByPlaceholderText, getAllByTestId } =
      renderQueryProviderTest(<CardPaymentWithPinCode />);

    await act(async () => {
      fireEvent.change(getByPlaceholderText('Choose an account to transfer'), {
        target: { value: MOCK_FILTER_DATA_USERS[0].email },
      });

      fireEvent.change(getByPlaceholderText('0.00'), {
        target: { value: '20' },
      });

      fireEvent.click(getByText('Send Money'));
    });

    await waitFor(async () =>
      expect(getByText('Please enter your PIN code')).toBeInTheDocument(),
    );

    const pinInputFields = getAllByTestId('pin-input');

    act(() => {
      fireEvent.change(pinInputFields[0], { target: { value: '1' } });
      fireEvent.change(pinInputFields[1], { target: { value: '2' } });
      fireEvent.change(pinInputFields[2], { target: { value: '3' } });
      fireEvent.change(pinInputFields[3], { target: { value: '4' } });
    });

    await waitFor(() => expect(getByText('Submit')).toBeEnabled());

    act(() => {
      fireEvent.click(getByText('Submit'));
    });

    waitFor(() =>
      expect(getByText(SUCCESS_MESSAGES.SEND_MONEY.title)).toBeInTheDocument(),
    );
  });

  it('should Send Money failed', async () => {
    (authStore as unknown as jest.Mock).mockReturnValue({
      ...USERS_MOCK[0],
      bonusTimes: 10,
      pinCode: '1234',
    });

    (useGetUserDetails as jest.Mock).mockReturnValue({
      filterDataUser: [{ ...MOCK_FILTER_DATA_USERS[0], _id: null }],
    });

    (usePinCode as jest.Mock).mockReturnValue({
      confirmPinCode: jest.fn((_, { onSuccess }) => onSuccess()),
      setNewPinCode: jest.fn(),
    });

    (useMoney as jest.Mock).mockReturnValue({
      sendMoneyToUserWallet: jest.fn((_, { onError }) => onError()),
      isSendMoneySubmitting: false,
    });

    const { getByText, getByPlaceholderText, getAllByTestId } =
      renderQueryProviderTest(<CardPaymentWithPinCode />);

    act(() => {
      fireEvent.change(getByPlaceholderText('Choose an account to transfer'), {
        target: { value: MOCK_FILTER_DATA_USERS[0].email },
      });

      fireEvent.change(getByPlaceholderText('0.00'), {
        target: { value: '20' },
      });

      fireEvent.click(getByText('Send Money'));
    });

    await waitFor(async () =>
      expect(getByText('Please enter your PIN code')).toBeInTheDocument(),
    );

    const pinInputFields = getAllByTestId('pin-input');

    act(() => {
      fireEvent.change(pinInputFields[0], { target: { value: '1' } });
      fireEvent.change(pinInputFields[1], { target: { value: '2' } });
      fireEvent.change(pinInputFields[2], { target: { value: '3' } });
      fireEvent.change(pinInputFields[3], { target: { value: '4' } });
    });

    await waitFor(() => expect(getByText('Submit')).toBeEnabled());

    act(() => {
      fireEvent.click(getByText('Submit'));
    });

    waitFor(() =>
      expect(getByText(ERROR_MESSAGES.SEND_MONEY.title)).toBeInTheDocument(),
    );
  });
});
