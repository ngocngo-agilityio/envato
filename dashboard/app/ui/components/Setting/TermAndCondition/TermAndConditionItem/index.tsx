// Libs
import { memo } from 'react';
import { Box, Text } from '@chakra-ui/react';

export type TermAndConditionProps = {
  heading: string;
  content: string;
  description?: string;
  note?: string;
};

const TermAndConditionItem = ({
  heading,
  content,
  description = '',
  note = '',
}: TermAndConditionProps) => (
  <Box mb={8}>
    <Text as="h4" fontWeight="bold" fontSize="lg" mb={3} color="text.textTitle">
      {heading}
    </Text>
    <Text mb={3} fontSize="md" color="text.binary">
      {content}
    </Text>
    <Text fontSize="md" color="text.binary">
      {description}
    </Text>

    {note && (
      <Box
        mt={2}
        bg="background.component.secondary"
        p={2}
        borderRadius="md"
        px={7}
        py={6}
      >
        <Text fontSize="md" color="text.textNote">
          {note}
        </Text>
      </Box>
    )}
  </Box>
);

const TermAndConditionItemMemorized = memo(TermAndConditionItem);

export default TermAndConditionItemMemorized;
