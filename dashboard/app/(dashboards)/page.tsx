import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import lazy from 'next/dynamic';

// Constants
import { END_POINTS } from '@/lib/constants';

// Interface
import {
  IEfficiency,
  IRevenueFlow,
  ISpendingStatistics,
} from '@/lib/interfaces';

// Utils
import { prefetch } from '@/lib/utils';

const DashBoardSection = lazy(() => import('@/ui/sections/DashBoard'));

export const dynamic = 'force-dynamic';

const Dashboard = async () => {
  const queryClient = new QueryClient();

  // Prefetch total statistics, revenue and efficiency data
  await prefetch<ISpendingStatistics[]>(END_POINTS.STATISTICS, queryClient);
  await prefetch<IRevenueFlow[]>(END_POINTS.REVENUE, queryClient);
  await prefetch<IEfficiency[]>(`${END_POINTS.EFFICIENCY}/weekly`, queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashBoardSection />
    </HydrationBoundary>
  );
};

export default Dashboard;
