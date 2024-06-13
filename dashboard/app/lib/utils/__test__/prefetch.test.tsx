import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
// Services
import * as services from '@/lib/services';

// Utils
import { prefetch } from '@/lib/utils';

// Constants
import { END_POINTS } from '@/lib/constants';

// Mocks
import { SPENDING_STATISTICS_MOCK } from '@/lib/mocks';

const queryClient = new QueryClient();
const Wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.mock('@/lib/services');

describe('prefetch', () => {
  it('should prefetch data for the given endpoint', async () => {
    jest
      .spyOn(services, 'getStatistical')
      .mockResolvedValue(SPENDING_STATISTICS_MOCK);

    testLibReactUtils.render(
      <Wrapper>
        <div>Test</div>
      </Wrapper>,
    );
    await prefetch(END_POINTS.STATISTICS, queryClient);
    await testLibReactUtils.waitFor(() => {
      expect(queryClient.getQueryData([END_POINTS.STATISTICS])).toEqual(
        SPENDING_STATISTICS_MOCK,
      );
    });
  });
});
