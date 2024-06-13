// Libs
import { QueryClient, QueryKey } from '@tanstack/react-query';

// Services
import { mainHttpService } from '@/lib/services';

export const prefetch = async <T>(
  endPoint: string,
  queryClient: QueryClient,
  queryKey?: QueryKey,
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKey || [endPoint],
    queryFn: async () =>
      (await mainHttpService.get<T>({ path: endPoint })).data,
  });
};
