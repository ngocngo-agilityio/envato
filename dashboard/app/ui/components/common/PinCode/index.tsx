'use client';

import { FormEvent, memo } from 'react';
import {
  Button,
  HStack,
  PinInput,
  PinInputField,
  VStack,
} from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { Control, Controller } from 'react-hook-form';

// Constants
import { AUTH_SCHEMA } from '@/lib/constants';

// Types
import { TPinCodeForm } from '@/lib/interfaces';

// Themes
import { colors } from '@/ui/themes/bases/colors';

export type TPinCodeProps = {
  control: Control<TPinCodeForm>;
  isDisabled?: boolean;
  isLoading?: boolean;
  onSubmit: (e: FormEvent<HTMLDivElement>) => void;
  onClose: () => void;
};

const defaultStyle = {
  caretColor: 'transparent',
  fontFamily: 'caption',
  fontSize: '24px',
};

const PinCodeComponent = ({
  control,
  isDisabled = false,
  isLoading = false,
  onSubmit,
  onClose,
}: TPinCodeProps) => (
  <VStack as="form" onSubmit={onSubmit}>
    <HStack justifyContent="center" gap={2}>
      <Controller
        control={control}
        rules={AUTH_SCHEMA.PIN_CODE}
        name="pinCode"
        defaultValue=""
        render={({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          field: { onChange, value, ref: _, ...rest },
          fieldState: { error, invalid },
        }) => (
          <PinInput
            {...rest}
            errorBorderColor={colors.danger[400]}
            isInvalid={!!error || invalid}
            onChange={onChange}
            value={value}
            mask
            variant="filled"
          >
            <PinInputField sx={defaultStyle} data-testid="pin-input" />
            <PinInputField sx={defaultStyle} data-testid="pin-input" />
            <PinInputField sx={defaultStyle} data-testid="pin-input" />
            <PinInputField sx={defaultStyle} data-testid="pin-input" />
          </PinInput>
        )}
      />
    </HStack>
    <HStack w="full" mx={6} my={4} gap={4}>
      <Button type="submit" isDisabled={isDisabled} isLoading={isLoading}>
        Submit
      </Button>
      <Button onClick={onClose} bg="orange.300" _hover={{ bg: 'orange.400' }}>
        Cancel
      </Button>
    </HStack>
  </VStack>
);

const PinCode = memo(PinCodeComponent, isEqual);

export default PinCode;
