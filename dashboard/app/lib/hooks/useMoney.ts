import { useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import { addMoneyToUser, sendMoneyToUser } from '@/lib/services';

// Types
import { EActivity, TAddMoney, TSendMoney } from '@/lib/interfaces';

// Constants
import { END_POINTS } from '@/lib/constants';

// Hook
import { authStore } from '../stores';

export const useMoney = () => {
  const { user } = authStore();
  const queryClient = useQueryClient();

  const { mutate: addMoneyToUserWallet } = useMutation({
    mutationFn: (userData: TAddMoney) =>
      addMoneyToUser(userData, user?.id, EActivity.ADD_MONEY),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [END_POINTS.MY_WALLET],
      });
      queryClient.invalidateQueries({
        queryKey: [END_POINTS.TRANSACTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [END_POINTS.NOTIFICATION],
      });
    },
  });

  const { mutate: sendMoneyToUserWallet } = useMutation({
    mutationFn: (userData: TSendMoney) =>
      sendMoneyToUser(userData, user?.id, EActivity.SEND_MONEY),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [END_POINTS.MY_WALLET],
      });
      queryClient.invalidateQueries({
        queryKey: [END_POINTS.TRANSACTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [END_POINTS.NOTIFICATION],
      });
    },
  });

  return {
    addMoneyToUserWallet,
    sendMoneyToUserWallet,
  };
};
