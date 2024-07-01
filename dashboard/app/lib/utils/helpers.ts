// Constants
import { REGEX, DOTS, ERROR_MESSAGES } from '@/lib/constants';

// Types
import { FormatPaginationParams, PaginationTableType } from '@/lib/interfaces';

export const formatNumberButton = (numberOfPage: number): string[] =>
  Array.from({ length: numberOfPage }).map((_, index: number): string =>
    (index + 1).toString(),
  );

export const formatPageArray = ({
  totalPage = 0,
  currentPage = 0,
}: PaginationTableType): string[] => {
  // If the number of pages is less than or equal to 5, display all page buttons
  if (totalPage <= 5) {
    return formatNumberButton(totalPage);
  }

  // If the current page is near the start (pages 1 to 3),
  // Display the first 3 pages and then DOTS and the last page
  if (currentPage <= 3) {
    return [...formatNumberButton(3), DOTS, totalPage.toString()];
  }

  // If the current page is near the end (within the last 3 pages),
  // display the first page, DOTS, and the last 3 pages
  if (currentPage >= totalPage - 2) {
    return ['1', DOTS, ...formatNumberButton(totalPage).splice(-3)];
  }

  // If the current page is in the middle,
  // Display the first page, DOTS, currentPage, DOTS, and the last page
  return ['1', DOTS, currentPage.toString(), DOTS, totalPage.toString()];
};

export const formatPagination = ({
  totalCount,
  limit,
  currentPage,
}: FormatPaginationParams): string[] => {
  const totalPage = Math.ceil(totalCount / limit);

  return formatPageArray({ totalPage, currentPage });
};

export const validatePassword = (value: string) => {
  if (!value) {
    return ERROR_MESSAGES.FIELD_REQUIRED('Password');
  }

  if (!REGEX.LENGTH_IS_EIGHT.test(value)) {
    return ERROR_MESSAGES.PASS_WORD_SHORT;
  }

  if (!REGEX.PASSWORD.test(value)) {
    return ERROR_MESSAGES.PASS_WORD_WEAK;
  }

  return true;
};

export const formatUppercaseFirstLetter = (value = ''): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const formatDecimalInput = (value = ''): string => {
  const validData = /(^[0-9])[^.]*((?:\.\d*)?)/.exec(
    value.replace(/[^(\d|.)]/g, ''),
  );

  const formatValue = validData ? validData[0] : '';

  return formatValue;
};

export const formatAmountNumber = (value: string): string => {
  if (!value) {
    return value;
  }

  if (Number.isNaN(parseFloat(value))) {
    return '';
  }

  const dotIndex = value.indexOf('.');
  const decimalValue = dotIndex > -1 ? value.slice(dotIndex) : '';
  const newValue =
    dotIndex > -1
      ? value.slice(0, dotIndex).replaceAll(',', '')
      : value.replaceAll(',', '');

  const newValueFormat = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (
    !REGEX.AMOUNT_PATTERN.test(newValue) ||
    !REGEX.DECIMAL_PATTERN.test(decimalValue)
  ) {
    return `${newValueFormat}.${decimalValue
      .substring(0, 3)
      .replaceAll(/[.]/g, '')}`;
  }

  return decimalValue ? `${newValueFormat}${decimalValue}` : newValueFormat;
};

/**
 * Remove amount format ex: 12,345.00 -> 12345
 * @param amount string
 * @returns number
 */
export const removeAmountFormat = (amount: string): number =>
  +amount.replaceAll(',', '');

export const parseFormattedNumber = (value: string): number => {
  if (!value) {
    return 0;
  }

  const cleanValue = String(value).replace(REGEX.FORMAT_NUMBER, '');

  const parsedNumber = parseFloat(cleanValue);

  if (Number.isNaN(parsedNumber)) {
    return 0;
  }

  return parsedNumber;
};

/**
 * Format number rg: 12345 -> 12,345.00 if isOmitDecimals = false or 12,345 if isOmitDecimals = true
 * @param number
 * @param isOmitDecimals
 * @returns Number after format
 */
export const formatDecimalNumber = (
  number = 0,
  isOmitDecimals: boolean = false,
): string => {
  const formattedNumber = isOmitDecimals
    ? Math.round(number).toString()
    : number.toFixed(2);

  const numberWithCommas = formattedNumber.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ',',
  );

  return numberWithCommas;
};

// Format for typing numbers in input
export const formatAllowOnlyNumbers = (input: string): string => {
  if (!input) {
    return ''; // or handle the case when input is undefined or null
  }

  // Replace any non-digit character with an empty string
  return input.replace(/[^0-9]/g, '');
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'online':
      return 'green.500';
    case 'offline':
      return 'gray.500';
    default:
      return 'gray.500';
  }
};

export const isWindowDefined = () => typeof window !== 'undefined';
