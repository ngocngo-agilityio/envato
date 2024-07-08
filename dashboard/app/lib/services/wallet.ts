// Constants
import { END_POINTS, QUERY_TAGS } from '@/lib/constants';

// Services
import { mainHttpServiceWithFetch } from '@/lib/services';

// Types
import { TWallet } from '@/lib/interfaces';

export const getMyWallet = async (userId: string) => {
  const endpoint = `${END_POINTS.MY_WALLET}/${userId}`;

  const currentWalletMoney: TWallet = await mainHttpServiceWithFetch.getRequest(
    {
      endpoint,
      configOptions: { next: { tags: [QUERY_TAGS.MY_WALLET] } },
    },
  );

  return { currentWalletMoney };
};
