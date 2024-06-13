'use client';

// Libs
import { ReactElement, memo } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Collapse,
  Divider,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

export type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const COLOR = 'primary.500';

  const { isOpen: isOpenAnswer, onToggle: onToggleAnswer } = useDisclosure();

  const icons: Record<'true' | 'false', ReactElement> = {
    true: <MinusIcon color={COLOR} />,
    false: <AddIcon color={COLOR} />,
  };

  return (
    <Box>
      <Flex
        onClick={onToggleAnswer}
        cursor="pointer"
        align="center"
        mb={5}
        pb={5}
        borderBottom="1px solid"
        borderColor="border.quinary"
        color="text.quinary"
      >
        {icons[`${isOpenAnswer}`]}
        <Text ml={5} fontWeight="bold" color="text.quinary" fontSize="lg">
          {question}
        </Text>
      </Flex>
      <Collapse in={isOpenAnswer} animateOpacity>
        <Flex flex={1} pb={4}>
          <Divider
            orientation="vertical"
            height="auto"
            borderColor={COLOR}
            borderWidth="1px"
            borderRadius="lg"
            marginLeft={9}
          />
          <Flex>
            <Text color="secondary.1050" fontSize="sm" lineHeight="7" pl={4}>
              {answer}
            </Text>
          </Flex>
        </Flex>
      </Collapse>
    </Box>
  );
};

const FaqItemMemorized = memo(FaqItem);

export default FaqItemMemorized;
