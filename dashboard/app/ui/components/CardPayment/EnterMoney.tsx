import { memo, useTransition } from 'react';
import {
  Box,
  Button,
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
import { TTransfer } from '@/lib/interfaces';

export type TEnterMoneyProps = {
  control: Control<TTransfer>;
  isDisabled?: boolean;
  isLoading?: boolean;
};

const EnterMoney = ({
  control,
  isDisabled = false,
  isLoading = false,
}: TEnterMoneyProps): JSX.Element => {
  const [, startTransition] = useTransition();

  return (
    <>
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
            rules={AUTH_SCHEMA.TRANSFER_AMOUNT}
            name="amount"
            defaultValue=""
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              const handleChange = (
                event: React.ChangeEvent<HTMLInputElement>,
              ) => {
                startTransition(() => {
                  const value: string = event.target.value;

                  if (isNaN(+value.replaceAll(',', ''))) return;

                  // Remove non-numeric characters and leading zeros
                  const sanitizedValue = formatAmountNumber(value);

                  onChange(sanitizedValue);
                });
              };

              return (
                <FormControl isInvalid={!!error} mr={{ md: 2 }}>
                  <Input
                    variant="authentication"
                    type="text"
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
                    onChange={handleChange}
                    autoComplete="off"
                    position="static"
                    isInvalid={!!error}
                  />
                  {!!error && (
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  )}
                </FormControl>
              );
            }}
          />
        </Flex>
      </Box>

      <Button
        aria-label="btn-send-money"
        mt={4}
        colorScheme="primary"
        bg="primary.300"
        fontWeight="bold"
        type="submit"
        isDisabled={isDisabled}
        isLoading={isLoading}
      >
        Send Money
      </Button>
    </>
  );
};

const EnterMoneyMemorized = memo(EnterMoney, isEqual);
export default EnterMoneyMemorized;
