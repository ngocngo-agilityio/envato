import { memo, useCallback } from 'react';
import { Box, Flex, Text, theme } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';

// Components
import { Button, Select } from '@/ui/components';
import { Arrow } from '@/ui/components/Icons';

// Constants
import { DOTS, NEXT, PAGE_SIZE, PAGINATION, PREV } from '@/lib/constants';

// Interfaces
import { TOption } from '@/ui/components/common/Select';

interface PaginationProps {
  pageSize?: number;
  currentPage?: number;
  isDisabledPrev?: boolean;
  isDisableNext?: boolean;
  arrOfCurrButtons?: string[];
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

  const handleNextPage = useCallback(() => onPageChange(NEXT), [onPageChange]);

  const handlePrevPage = useCallback(() => onPageChange(PREV), [onPageChange]);

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
    <Flex
      data-testid="pagination"
      justifyContent="space-between"
      mt={8}
      flexDir={{ base: 'column', default: 'row' }}
      flexWrap="wrap"
      gap={{ base: 5, default: 0 }}
    >
      <Flex alignItems="center">
        <Text w={100} fontSize="sm" fontWeight="semibold" color="text.primary">
          Show result:
        </Text>
        <Box
          w={70}
          borderRadius="lg"
          borderWidth="1px"
          backgroundColor="border.denary"
          borderColor="border.nonary"
        >
          <Select
            options={PAGINATION}
            renderTitle={renderTitle}
            onSelect={onLimitChange}
          />
        </Box>
      </Flex>
      <Flex alignItems="center">
        <Button
          width={{ base: 6, default: 30 }}
          height={{ base: 6, default: 30 }}
          data-testid="prev-button"
          aria-label="btn-prev"
          variant="iconSecondary"
          cursor={isDisabledPrev ? 'not-allowed' : ''}
          isDisabled={isDisabledPrev}
          onClick={handlePrevPage}
        >
          <Arrow color={colorFill} rotate="90deg" />
        </Button>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          w={{ base: '100%', default: 'auto' }}
        >
          {arrOfCurrButtons.map((item: string, index: number) => {
            const isDots = item === DOTS;
            const isDisable = currentPage === +item || isDots;
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
            const handleClickPage = () => onClickPage(+item);

            return (
              <Button
                key={`${item}-${index}`}
                data-testid={`page-${item}-button`}
                aria-label="btn-pages"
                isDisabled={isDisable}
                mx={0.5}
                h={{ base: 7, default: 30, '3xl': 53 }}
                fontSize={{ base: 'xs', lg: 'sm' }}
                px={{ base: 3, default: 4, '3xl': 6 }}
                bg={
                  currentPage === +item
                    ? 'background.body.quinary'
                    : 'transparent'
                }
                color={
                  currentPage === +item ? 'text.quaternary' : 'secondary.250'
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
          width={{ base: 6, default: 30 }}
          height={{ base: 6, default: 30 }}
        >
          <Arrow color={colorFill} rotate="-90deg" />
        </Button>
      </Flex>
    </Flex>
  );
};

const Pagination = memo(PaginationComponent, isEqual);
export default Pagination;
