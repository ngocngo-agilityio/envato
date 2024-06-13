'use client';

import { memo, useCallback, useState } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

// Components
import { Fetching, Select } from '@/ui/components';
import EfficiencyInfo from './EfficiencyInfo';
import EfficiencyRefetch from './Refetching';

// Constants
import { EFFICIENCY_OPTIONS } from '@/lib/constants';

// Hooks
import { useGetEfficiency } from '@/lib/hooks';

// Types
import { TOption } from '@/ui/components/common/Select';
import { EFFICIENCY_MOCK } from '@/lib/mocks';

// Icons
import { Arrow } from '@/ui/components/Icons';

// Themes
import { useColorfill } from '@/ui/themes/bases';

const Efficiency = () => {
  const [efficiencyType, setEfficiencyType] = useState<string>('weekly');

  const [isLoadingSelectEfficiencyType, setLoadingSelectEfficiencyType] =
    useState<boolean>(false);
  const { tertiary } = useColorfill();

  const {
    data: efficiencyData,
    isLoading: isLoadingEfficiency,
    isError: isErrorEfficiency,
  } = useGetEfficiency(efficiencyType);

  const { arrival, spending, statistical } = efficiencyData || EFFICIENCY_MOCK;

  const handleChangeSelectEfficiency = useCallback((data: TOption) => {
    setEfficiencyType(data.value);
    setLoadingSelectEfficiencyType(true);
  }, []);

  const renderTitle = useCallback(
    ({ label }: TOption) => (
      <Flex alignItems="center">
        <Text>{label}</Text>
        <Arrow color={tertiary} />
      </Flex>
    ),
    [tertiary],
  );

  if (isErrorEfficiency)
    return (
      <Heading
        as="h3"
        color="text.primary"
        bgColor="background.body.secondary"
        rounded="lg"
        boxShadow="sm"
        p={4}
      >
        Efficiency data error
      </Heading>
    );

  return (
    <Box bg="background.component.primary" rounded="lg">
      <Fetching
        isLoading={isLoadingEfficiency && !isLoadingSelectEfficiencyType}
        isError={isErrorEfficiency}
        variant="secondary"
        size="md"
      >
        <Flex
          py={4}
          px={5}
          borderBottom="1px"
          borderColor="border.primary"
          justifyContent="space-between"
        >
          <Heading variant="heading2Xl" as="h3">
            Efficiency
          </Heading>
          <Box h={21}>
            <Select
              options={EFFICIENCY_OPTIONS}
              size="sm"
              renderTitle={renderTitle}
              onSelect={handleChangeSelectEfficiency}
              data-testid="select-efficiency"
            />
          </Box>
        </Flex>
        {isLoadingEfficiency && isLoadingSelectEfficiencyType ? (
          <EfficiencyRefetch />
        ) : (
          <EfficiencyInfo
            spending={spending}
            statistical={statistical}
            arrival={arrival}
          />
        )}
      </Fetching>
    </Box>
  );
};

const EfficiencyMemorized = memo(Efficiency);

export default EfficiencyMemorized;
