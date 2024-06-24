// Libs
import { screen } from '@testing-library/react';

// HOCs
import withBalance from '../withBalance';

// Utils
import { renderQueryProviderTest } from '@/lib/utils';

// Mocks
import { USERS_MOCK } from '@/lib/mocks';

describe('withBalance HOC', () => {
  jest.mock('@/lib/stores', () => ({
    ...jest.requireActual('@/lib/stores'),
    authStore: jest.fn(() => USERS_MOCK[0]),
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
  }));
  interface Props {
    isShowBalance: boolean;
    onToggleShowBalance: () => void;
    balance: number;
  }

  const WrappedComponent = ({
    balance,
    isShowBalance,
    onToggleShowBalance,
  }: Props) => (
    <div>
      <div>Balance:</div>
      <div>{isShowBalance ? balance : '***'}</div>
      <button onClick={onToggleShowBalance}>Toggle Balance</button>
    </div>
  );

  const BalanceWrapper = withBalance(WrappedComponent);

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('Should render correctly', () => {
    renderQueryProviderTest(<BalanceWrapper />);

    expect(screen.getByText('***')).toBeInTheDocument();
  });
});
