'use client';

import { memo } from 'react';

// Components
import { Box, Button, Flex, Text } from '@chakra-ui/react';

interface Props {
  itemName?: string;
  onDelete: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModalBody = ({ itemName, onDelete, onCancel }: Props) => (
  <Box>
    <Text fontSize="md" w={{ base: 364 }} noOfLines={2}>
      Are you sure delete
      <Text as="span" pl={1} color="red.500" fontWeight="bold" maxW={120}>
        {itemName}
      </Text>
      ?
    </Text>
    <Flex my={4} justifyContent="center">
      <Button
        w={44}
        bg="green.600"
        mr={3}
        onClick={onDelete}
        data-testid="accept-del"
      >
        Delete
      </Button>
      <Button
        w={44}
        bg="orange.300"
        _hover={{ bg: 'orange.400' }}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Flex>
  </Box>
);

const ConfirmDeleteModalMemorized = memo(ConfirmDeleteModalBody);
export default ConfirmDeleteModalMemorized;
