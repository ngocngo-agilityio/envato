import { Box, Flex, Text } from '@chakra-ui/react';
import { memo } from 'react';

type TStatisticalProps = {
  title: string;
  color: string;
  value: number;
};

const Statistical = ({
  title,
  color,
  value,
}: TStatisticalProps): JSX.Element => (
  <Flex dir="row" w="full" alignItems="center">
    <Box bg={color} w="10px" height="10px" rounded="50%" />
    <Text ml={3} variant="textSm">
      {title}
    </Text>
    <Text
      fontSize="sm"
      fontWeight="bold"
      color="text.primary"
      sx={{ marginLeft: 'auto' }}
    >
      {value}%
    </Text>
  </Flex>
);

const StatisticalMemorized = memo(Statistical);

export default StatisticalMemorized;
