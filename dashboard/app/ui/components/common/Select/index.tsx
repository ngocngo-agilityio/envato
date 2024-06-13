'use client';

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  MenuProps,
  Flex,
  Box,
  theme,
} from '@chakra-ui/react';
import { MouseEventHandler, memo, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';

// Components
import { Arrow } from '@/ui/components/Icons';

// Themes
import { SIZES } from '@/ui/themes/components';

export type TOption = {
  value: string;
  label: string;
};

type TSelectProps = Pick<MenuProps, 'size' | 'variant'> & {
  title?: string;
  options?: TOption[];
  renderTitle: (option: TOption) => JSX.Element;
  onSelect?: (option: TOption) => void;
};

const SelectComponent = ({
  options = [],
  variant = 'primary',
  size = 'md',
  renderTitle,
  onSelect,
}: TSelectProps): JSX.Element => {
  const [selected, setSelected] = useState<number>(0);
  const colorFill = theme.colors.gray[400];

  const memorizedTitle = useMemo(
    () => renderTitle(options[selected]),
    [options, renderTitle, selected],
  );

  return (
    <Menu matchWidth>
      <MenuButton
        as={Button}
        h="100%"
        w="100%"
        textAlign="center"
        borderRadius="lg"
        px={0}
        variant={variant}
        size={size}
      >
        {options[selected]?.label === 'Default' ? (
          memorizedTitle
        ) : (
          <Flex justifyContent="center">
            <Text
              as="span"
              textAlign="center"
              fontSize="sm"
              color="text.currencyColor"
              textTransform="capitalize"
              gap={3}
            >
              {options[selected]?.label}
            </Text>
            <Box mt={-1} ml={2}>
              <Arrow color={colorFill} width={18} height={15} />
            </Box>
          </Flex>
        )}
      </MenuButton>
      <MenuList
        p={0}
        minW={101}
        boxShadow="lg"
        borderRight="lg"
        border="none"
        overflow="hidden"
        bg="background.component.selectList"
      >
        {options.map((option: TOption, index: number): JSX.Element => {
          const { label } = option;
          const handleSelected: MouseEventHandler = () => {
            setSelected(index);
            onSelect && onSelect(option);
          };

          return (
            <MenuItem
              key={label}
              bg="background.component.selectList"
              borderRadius="none"
              py={2}
              _hover={{
                borderColor: 'transparent',
                _light: { bgColor: 'secondary.200' },
                _dark: { bgColor: 'secondary.400' },
              }}
              _focus={{ borderColor: 'transparent', outline: 'none' }}
              onClick={handleSelected}
              {...(SIZES[size as keyof typeof SIZES] ?? {})}
            >
              <Text
                fontSize="sm"
                fontWeight="semibold"
                textTransform="capitalize"
              >
                {label}
              </Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

const Select = memo(SelectComponent, isEqual);

export default Select;
