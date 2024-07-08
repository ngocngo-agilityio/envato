import { cookies } from 'next/headers';

// Services
import { getUserList } from '@/lib/services';

// Components
import { CardPayment as CardPaymentComponent } from '@/ui/components';

const CardPayment = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value || '';

  const { data } = await getUserList(userId);

  console.log('data', data);

  return <CardPaymentComponent />;
};

export default CardPayment;
