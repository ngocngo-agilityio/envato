import { memo, useCallback } from 'react';
import { Box, Flex, Text, theme } from '@chakra-ui/react';

// Components
import { Button, Select } from '@/ui/components';
import { Arrow, ArrowDown } from '@/ui/components/Icons';

// Constants
import { NEXT, PAGE_SIZE, PAGINATION, PREV } from '@/lib/constants';

// Interfaces
import { TOption } from '@/ui/components/common/Select';

interface PaginationProps {
  pageSize?: number;
  currentPage?: number;
  isDisabledPrev?: boolean;
  isDisableNext?: boolean;
  arrOfCurrButtons?: (number | string)[];
  onPageChange?: (direction: string) => void;
  onLimitChange?: (limit: TOption) => void;
  onClickPage?: (currentPage: number) => void;
}

const PaginationComponent = ({
  currentPage = 1,
  pageSize = PAGE_SIZE,
  arrOfCurrButtons = [],
  isDisabledPrev = false,
  isDisableNext = false,
  onPageChange = () => {},
  onLimitChange = () => {},
  onClickPage = () => {},
}: PaginationProps) => {
  const colorFill = theme.colors.gray[400];

  const handleNextPage = () => onPageChange(NEXT);

  const handlePrevPage = () => onPageChange(PREV);
  const renderTitle = useCallback(
    () => (
      <Flex justifyContent="center">
        <Text fontSize={{ lg: 'sm' }}>{pageSize}</Text>
        <Box mt={-1} ml={2}>
          <Arrow color={colorFill} width={18} height={15} />
        </Box>
      </Flex>
    ),
    [colorFill, pageSize],
  );

  return (
    <Flex data-testid="pagination" justifyContent="space-between" mt={8}>
      <Flex alignItems="center">
        <Text w={100} fontSize="sm" fontWeight="semibold" color="text.primary">
          Show result:
        </Text>
        <Box
          w={70}
          display="flex"
          alignItems="center"
          borderRadius="lg"
          borderWidth="1px"
          backgroundColor="border.denary"
          borderColor="border.nonary"
          flexDirection="row"
        >
          <Select
            options={PAGINATION}
            renderTitle={renderTitle}
            onSelect={onLimitChange}
          />
          <ArrowDown />
        </Box>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Button
          width={30}
          height={30}
          data-testid="prev-button"
          aria-label="btn-prev"
          variant="iconSecondary"
          cursor={isDisabledPrev ? 'not-allowed' : ''}
          isDisabled={isDisabledPrev}
          onClick={handlePrevPage}
        >
          <Arrow color={colorFill} rotate="90deg" />
        </Button>
        <Flex alignItems="center">
          {arrOfCurrButtons.map((item: string | number) => {
            const isDots = item.toString() === '...';
            const isDisable = currentPage === item || isDots;
            const hoverStyle = isDots
              ? {}
              : {
                  color: 'text.currencyColor',
                  bg: 'background.body.quinary',
                };
            const disableStyle = isDots
              ? {}
              : {
                  color: 'text.quaternary',
                  bg: 'background.body.quinary',
                };
            const handleClickPage = () => onClickPage(item as number);
            return (
              <Button
                key={item}
                data-testid={`page-${item}-button`}
                aria-label="btn-pages"
                isDisabled={isDisable}
                mx={0.5}
                h={{ base: 30, '2xl': 53 }}
                fontSize={{ base: 'xs', lg: 'sm' }}
                px={{ base: 4, '2xl': 6 }}
                bg={
                  currentPage === item
                    ? 'background.body.quinary'
                    : 'transparent'
                }
                color={
                  currentPage === item ? 'text.quaternary' : 'secondary.250'
                }
                {...(isDots && { cursor: 'not-allowed' })}
                _hover={hoverStyle}
                _disabled={disableStyle}
                onClick={handleClickPage}
              >
                {item}
              </Button>
            );
          })}
        </Flex>
        <Button
          data-testid="next-button"
          aria-label="btn-next"
          variant="iconSecondary"
          cursor={isDisableNext ? 'not-allowed' : ''}
          isDisabled={isDisableNext}
          onClick={handleNextPage}
          width={30}
          height={30}
        >
          <Arrow color={colorFill} rotate="-90deg" />
        </Button>
      </Flex>
    </Flex>
  );
};

const Pagination = memo(PaginationComponent);
export default Pagination;
