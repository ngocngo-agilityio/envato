// Libs
import { screen } from '@testing-library/react';

// HOCs
import withBalance from '../withBalance';

// Utils
import { renderQueryProviderTest } from '@/lib/utils';
import { USER_DETAIL_MOCK } from '@/lib/mocks';

interface Props {
  isShowBalance: boolean;
  onToggleShowBalance: () => void;
  balance: number;
}

jest.mock('@/lib/stores', () => ({
  authStore: jest.fn(() => USER_DETAIL_MOCK[0]),
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

const WrappedComponent = ({
  balance,
  isShowBalance,
  onToggleShowBalance,
}: Props) => (
  <div>
    <div>Balance: {isShowBalance ? balance : '***'}</div>
    <button onClick={onToggleShowBalance}>Toggle Balance</button>
  </div>
);

describe('withBalance HOC', () => {
  const BalanceWrapper = withBalance(WrappedComponent);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correctly', () => {
    renderQueryProviderTest(<BalanceWrapper />);

    expect(screen.getByText('***')).toBeInTheDocument();
  });
});
