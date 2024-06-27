// Libs
import { memo } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from '@chakra-ui/react';
import { Control, Controller } from 'react-hook-form';
import isEqual from 'react-fast-compare';

// Constants
import { AUTH_SCHEMA } from '@/lib/constants';

// Utils
import { formatAmountNumber } from '@/lib/utils';

// Types
import { TAddMoneyForm } from '@/lib/interfaces';

export type TAddMoneyInputFieldProps = {
  control: Control<TAddMoneyForm>;
};

const AddMoneyInputField = ({
  control,
}: TAddMoneyInputFieldProps): JSX.Element => (
  <Box
    border="1px solid"
    borderColor="border.secondary"
    p={4}
    mt={5}
    borderRadius="lg"
  >
    <Text color="text.secondary"> Enter amount </Text>
    <Flex direction="row" alignItems="center" mb={{ sm: 2 }}>
      <Text color="text.primary" fontSize="2xl" fontWeight="bold">
        $
      </Text>
      <Controller
        control={control}
        name="amount"
        rules={AUTH_SCHEMA.TRANSFER_AMOUNT}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value: string = event.target.value;

            // Remove non-numeric characters and leading zeros
            const sanitizedValue = formatAmountNumber(value);

            onChange(sanitizedValue);
          };

          return (
            <FormControl isInvalid={!!error} mr={{ md: 2 }}>
              <Input
                variant="authentication"
                type="text"
                autoComplete="off"
                _dark={{
                  border: 'none',
                }}
                placeholder="0.00"
                sx={{ border: 'none', padding: 0 }}
                color="text.primary"
                fontWeight="bold"
                fontSize="2xl"
                ml={2}
                value={value}
                name="amount"
                isInvalid={!!error}
                onChange={handleChange}
              />
              {!!error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
            </FormControl>
          );
        }}
      />
    </Flex>
  </Box>
);

export const AddMoneyInput = memo(AddMoneyInputField, isEqual);
