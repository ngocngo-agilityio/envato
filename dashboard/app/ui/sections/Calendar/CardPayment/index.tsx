// Libs
import { cookies } from 'next/headers';

// Services
import { getMyWallet, getUserList } from '@/lib/services';

// Components
import { CardPaymentForCalendar } from '@/ui/components';

const CardPayment = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value || '';

  const [userListResponse, walletResponse] = await Promise.all([
    getUserList(userId),
    getMyWallet(userId),
  ]);

  const { data: userList } = userListResponse;
  const { currentWalletMoney } = walletResponse;
  const { balance = 0 } = currentWalletMoney || {};

  const filteredUserList = userList.filter((user) => user._id !== userId);

  return (
    <CardPaymentForCalendar userList={filteredUserList} balance={balance} />
  );
};

export default CardPayment;
