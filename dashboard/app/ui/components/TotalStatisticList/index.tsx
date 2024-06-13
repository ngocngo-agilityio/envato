'use client';

import { memo } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';

// Components
import { Fetching, TotalStatisticCard } from '@/ui/components';

// Hooks
import { useGetStatistic } from '@/lib/hooks';

// Mocks
import { INITIAL_TOTAL_STATISTICS } from '@/lib/mocks';

// Types
import { ISpendingStatistics } from '@/lib/interfaces';

const TotalStatisticList = () => {
  const {
    data = INITIAL_TOTAL_STATISTICS,
    isLoading,
    isError,
  } = useGetStatistic();

  return (
    <Fetching isError={isError} errorMessage="Total statistic data error">
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', xl: 'repeat(3, 1fr)' }}
        gap={6}
      >
        {data.map(
          ({ title, total, growth, weeklyIncome }: ISpendingStatistics) => (
            <GridItem key={title}>
              <TotalStatisticCard
                title={title}
                total={total}
                growth={growth}
                weeklyIncome={weeklyIncome}
                isLoading={isLoading}
              />
            </GridItem>
          ),
        )}
      </Grid>
    </Fetching>
  );
};

const TotalStatisticListMemorized = memo(TotalStatisticList);

export default TotalStatisticListMemorized;
