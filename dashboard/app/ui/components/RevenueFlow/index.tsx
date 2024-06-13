'use client';

import dynamic from 'next/dynamic';
import { memo, useCallback, useMemo, useState } from 'react';
import { Box, Flex, Heading, Skeleton, Text } from '@chakra-ui/react';

// Components
import { Fetching, Select } from '..';
import { Arrow } from '@/ui/components/Icons';

// Constants
import {
  MONTHS,
  REVENUE_FLOW_COLORS,
  REVENUE_FLOW_OPTIONS,
  REVENUE_FLOW_STATUS,
} from '@/lib/constants';

// Hooks
import { useGetRevenue } from '@/lib/hooks';

// Types
import { IRevenueFlow, RevenueFlowStatus } from '@/lib/interfaces';
import { TOption } from '@/ui/components/common/Select';

// Mocks
import { INITIAL_REVENUE_FLOW } from '@/lib/mocks';

// Themes
import { useColorfill } from '@/ui/themes/bases';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton bg="background.component.primary" h={230} />,
});

const RevenueFlow = () => {
  const [option, setOption] = useState<string>('Jan,Dec');
  const { data = INITIAL_REVENUE_FLOW, isLoading, isError } = useGetRevenue();

  const { primary } = useColorfill();

  const renderTitle = useCallback(
    ({ label }: TOption) => (
      <Flex alignItems="center">
        <Text fontSize="sm">{label}</Text>
        <Arrow color={primary} />
      </Flex>
    ),
    [primary],
  );

  const dataSelected = useMemo(() => {
    const [monthStart, monthEnd] = option.split(',');

    const rangeMonths = MONTHS.slice(
      MONTHS.findIndex((i) => i === monthStart),
      MONTHS.findIndex((i) => i === monthEnd) + 1,
    );

    const getRevenueFlowDetails = (
      key: keyof Omit<IRevenueFlow, 'id' | 'title'>,
    ) =>
      data.map((revenue: IRevenueFlow) =>
        rangeMonths.includes(revenue.title) ? revenue[key] : 0,
      );
    const result = [
      {
        data: getRevenueFlowDetails(RevenueFlowStatus.PENDING),
      },
      {
        data: getRevenueFlowDetails(RevenueFlowStatus.SINGED),
      },
      {
        data: getRevenueFlowDetails(RevenueFlowStatus.LOST),
      },
      {
        data: data.map((revenue: IRevenueFlow) =>
          rangeMonths.includes(revenue.title)
            ? 0
            : revenue.lost + revenue.pending + revenue.signed,
        ),
      },
    ];
    return result;
  }, [data, option]);

  const handleChangeSelect = useCallback((option: TOption) => {
    setOption(option.value);
  }, []);

  return (
    <Fetching
      isLoading={isLoading}
      isError={isError}
      errorMessage="Revenue flow data error"
      variant="secondary"
      size="md"
    >
      <Box py={3} px={6} bg="background.component.primary" rounded="lg">
        <Flex
          py={4}
          px={5}
          borderBottom="1px"
          borderColor="border.primary"
          justifyContent="space-between"
        >
          <Heading variant="heading2Xl" as="h3">
            Revenue Flow
          </Heading>
          <Flex gap={7} display={{ base: 'none', lg: 'flex' }}>
            {REVENUE_FLOW_STATUS.map((item, index) => (
              <Flex key={item} gap={2} alignItems="center">
                <Box
                  bgColor={REVENUE_FLOW_COLORS[index]}
                  w={3}
                  height={3}
                  rounded="50%"
                />
                <Text variant="textSm">{item}</Text>
              </Flex>
            ))}
          </Flex>
          <Box
            w={120}
            h="37px"
            bgColor="background.body.primary"
            borderRadius={8}
          >
            <Select
              options={REVENUE_FLOW_OPTIONS}
              size="sm"
              variant="no-border"
              renderTitle={renderTitle}
              onSelect={handleChangeSelect}
            />
          </Box>
        </Flex>
        <Chart
          options={{
            chart: {
              stacked: true,
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: data.map((item) => item.title),
              axisTicks: {
                show: false,
              },
              labels: {
                style: {
                  colors: primary,
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  colors: primary,
                },
              },
            },
            legend: {
              show: false,
            },
            colors: REVENUE_FLOW_COLORS,
            dataLabels: {
              enabled: false,
            },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex }) {
                const status = REVENUE_FLOW_STATUS[seriesIndex]
                  ? `${REVENUE_FLOW_STATUS[seriesIndex]}:`
                  : '';

                return `<div style="padding: 10px; background-color: black; color: white" >
            <p>
            ${data[dataPointIndex].title}
            </p>
            <span>
            ${status} ${series[seriesIndex][dataPointIndex]}%
            </span>
            </div>`;
              },
            },
          }}
          series={dataSelected}
          type="bar"
          width="100%"
          height="230"
        />
      </Box>
    </Fetching>
  );
};

const RevenueFlowMemorized = memo(RevenueFlow);

export default RevenueFlowMemorized;
