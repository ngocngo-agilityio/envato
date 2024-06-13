'use client';

// Libs
import { memo, useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Flex, Heading, Skeleton, Text } from '@chakra-ui/react';

// Components
import { Arrow } from '@/ui/components/Icons';
import Select, { TOption } from '@/ui/components/common/Select';
import { Fetching } from '..';

// Constants
import {
  OVERALL_BALANCE_COLORS,
  OVERALL_BALANCE_MONTH,
  REVENUE_FLOW_OPTIONS,
  REVENUE_FLOW_STATUS,
} from '@/lib/constants';

// Hooks
import { useGetOverallBalance } from '@/lib/hooks';

// Utils
import { formatDecimalNumber } from '@/lib/utils';

// Types
import { IRevenueFlow } from '@/lib/interfaces';

// Mocks
import { INITIAL_OVERALL_BALANCE } from '@/lib/mocks';

// Themes
import { useColorfill } from '@/ui/themes/bases';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton bg="background.component.primary" h={225} />,
});

type TOverallData = Omit<IRevenueFlow, 'pending'>[];

const OverallBalance = () => {
  const {
    data: overallBalanceData = INITIAL_OVERALL_BALANCE,
    isLoading: isLoadingOverallBalance,
    isError: isErrorOverallBalance,
  } = useGetOverallBalance();

  const { data = [], total = 0, growth = 0 } = overallBalanceData;

  const [option, setOption] = useState<string>('');

  const { primary } = useColorfill();

  // Handle data when select option
  const dataSelected = useMemo(() => {
    const temp: TOverallData = [...data];
    const result: Record<string, TOverallData> = {
      [OVERALL_BALANCE_MONTH.JAN_JUN]: temp.slice(0, -6),
      [OVERALL_BALANCE_MONTH.JULY_DEC]: temp.slice(-6),
    };
    return result[option] || data;
  }, [data, option]);

  const renderTitle = useCallback(
    ({ label }: TOption) => (
      <Flex alignItems="center">
        <Text>{label}</Text>
        <Arrow color={primary} />
      </Flex>
    ),
    [primary],
  );

  const handleChangeSelect = useCallback(({ value }: TOption) => {
    setOption(value);
  }, []);

  return (
    <Fetching
      isLoading={isLoadingOverallBalance}
      isError={isErrorOverallBalance}
      errorMessage="Overall Balance data error"
      variant="secondary"
      size="md"
    >
      <Box bg="background.component.primary" rounded="lg">
        <Box>
          <Flex
            p={4}
            borderBottom="1px"
            borderColor="border.primary"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box px={{ base: 0, '3xl': 4 }}>
              <Text variant="textSm">Overall Balance</Text>
              <Flex align="center" gap={2}>
                <Heading variant="heading2Xl" as="h3">
                  ${formatDecimalNumber(total)}
                </Heading>
                <Text color="text.currencyColor">{growth}%</Text>
              </Flex>
            </Box>
            <Flex gap={7} display={{ base: 'none', lg: 'flex' }}>
              {REVENUE_FLOW_STATUS.slice(0, -1).map((item, index) => (
                <Flex key={item} gap={2} alignItems="center">
                  <Box
                    bgColor={OVERALL_BALANCE_COLORS[index]}
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
              pl={5}
              borderRadius={8}
              pr={{ base: 0, '3xl': 4 }}
            >
              <Select
                options={REVENUE_FLOW_OPTIONS}
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
                categories: dataSelected.map((item) => item.title),
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
              colors: OVERALL_BALANCE_COLORS,
              dataLabels: {
                enabled: false,
              },
              tooltip: {
                custom: function ({ series, dataPointIndex }) {
                  return `<div style="padding: 10px; background-color: black; color: white">
                <div style="font-weight: bold">
                ${dataSelected[dataPointIndex].title}
                </div>
                <p>
                ${REVENUE_FLOW_STATUS[0]}: $${formatDecimalNumber(
                  series[0][dataPointIndex],
                )}
                </p>
                <p>
                ${REVENUE_FLOW_STATUS[1]}: $${formatDecimalNumber(
                  series[1][dataPointIndex],
                )}
                </p>
                </div>`;
                },
              },
            }}
            series={[
              {
                data: dataSelected.map(({ signed }) => signed),
              },
              {
                data: dataSelected.map(({ lost }) => lost),
              },
            ]}
            type="area"
            height="210"
            width="100%"
          />
        </Box>
      </Box>
    </Fetching>
  );
};

const OverallBalanceMemorized = memo(OverallBalance);

export default OverallBalanceMemorized;
