'use client';

// Libs
import { memo } from 'react';
import dynamic from 'next/dynamic';
import { Box, Image, HStack, Text, Flex, Skeleton } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';

// Constants
import { IMAGES } from '@/lib/constants';

// Utils
import { formatDecimalNumber } from '@/lib/utils';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton bg="background.component.primary" h={108} />,
});

interface TotalCardComponentProps {
  title: string;
  total: number;
  growth: number;
  weeklyIncome: number[];
  isLoading?: boolean;
}

const TotalCard = ({
  title = 'Total',
  total = 0,
  growth = 0,
  weeklyIncome = [],
  isLoading = false,
}: TotalCardComponentProps) => (
  <Box p={5} bg="background.component.primary" rounded="lg">
    <Flex alignItems="center" justifyContent="space-between" mb={5}>
      <HStack w="fit-content">
        <Image
          w={12}
          h={38}
          src={IMAGES.TOTAL_EARN.url}
          alt={IMAGES.TOTAL_EARN.alt}
        />
        <Text
          variant={{ base: 'textMd', md: 'textLg' }}
          as="h2"
          fontWeight="semibold"
        >
          {title}
        </Text>
      </HStack>
    </Flex>
    {isLoading ? (
      <Skeleton bg="background.component.primary" h={108} />
    ) : (
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <Text variant={{ base: 'textLg', md: 'text3Xl' }}>
            ${formatDecimalNumber(total)}
          </Text>
          <HStack>
            <Image
              src={IMAGES.GROWTH.url}
              alt={IMAGES.GROWTH.alt}
              w={4}
              h={3.5}
            />
            <Text
              color="text.currencyColor"
              variant={{ base: 'textSm', md: 'textMd' }}
            >
              + {growth}%{' '}
              <Text
                as="span"
                variant={{ base: 'textXs', md: 'textSm' }}
                color="text.textInfo"
              >
                from last week
              </Text>
            </Text>
          </HStack>
        </Box>
        <Box maxW="150">
          <Chart
            options={{
              colors: ['#22C55E'],
              grid: {
                show: false,
              },
              xaxis: {
                labels: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
              },
              yaxis: {
                labels: {
                  show: false,
                },
              },
              tooltip: {
                enabled: false,
              },
              chart: {
                toolbar: {
                  show: false,
                },
                zoom: {
                  enabled: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
            }}
            series={[
              {
                data: weeklyIncome,
              },
            ]}
            type="area"
            width="100%"
            height="auto"
          />
        </Box>
      </Flex>
    )}
  </Box>
);

const TotalCardMemorized = memo(TotalCard, isEqual);

export default TotalCardMemorized;
