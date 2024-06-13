import { Badge, BadgeProps, Td, Tooltip } from '@chakra-ui/react';
import { memo } from 'react';

type TStatusProps = BadgeProps & {
  text: string;
};

const Status = ({ text = '', ...props }: TStatusProps): JSX.Element => (
  <Td
    py={5}
    px={0}
    fontSize="md"
    color="text.primary"
    fontWeight="semibold"
    textAlign="left"
    minW={120}
  >
    <Tooltip minW="max-content" placement="bottom" label={text}>
      <Badge
        {...props}
        maxW={100}
        whiteSpace="break-spaces"
        noOfLines={1}
        textAlign="center"
      >
        {text}
      </Badge>
    </Tooltip>
  </Td>
);

const StatusCellMemorized = memo(Status);

export default StatusCellMemorized;
