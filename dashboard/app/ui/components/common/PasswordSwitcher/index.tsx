// Libs
import { memo } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Icon as ChakraIcon } from '@chakra-ui/react';

interface PasswordSwitcherProps {
  isShow?: boolean;
  onClick: () => void;
}

const PasswordSwitcher = ({
  isShow = false,
  onClick,
}: PasswordSwitcherProps): JSX.Element => (
  <ChakraIcon
    color="gray.400"
    w="25px"
    h="25px"
    cursor="pointer"
    onClick={onClick}
    as={isShow ? ViewIcon : ViewOffIcon}
    data-testid="eye-icon"
  />
);

const PasswordSwitcherMemorized = memo(PasswordSwitcher);

export default PasswordSwitcherMemorized;
