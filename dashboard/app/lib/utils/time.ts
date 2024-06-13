import dayjs from 'dayjs';

// Constants
import {
  DATE_FORMAT,
  DISPLAY_DATE_FORMAT,
  MONTH_FORMAT,
} from '@/lib/constants';

export const getCurrentYear = (): number => {
  const currentYear = new Date().getFullYear();
  return currentYear;
};

export const getNextMonth = (): string =>
  dayjs().add(1, 'month').format(MONTH_FORMAT);

export const getCurrentDate = (): string => dayjs().format(DATE_FORMAT);

export const getCurrentDisplayDate = (): string =>
  dayjs().format(DISPLAY_DATE_FORMAT);

export const getCurrentTimeSeconds = (): number => Date.now() / 1000;

/**
 * @param timestamp
 * @returns
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(+timestamp);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

/**
 *
 * @param startDate (seconds)
 * @param dateOfExpiry
 * @returns
 */
export const getExpireTime = (
  startDate: number,
  dateOfExpiry: number,
): number => startDate + dateOfExpiry * 24 * 60 * 60; // startDate + dateOfExpiry * hour * minutes * seconds

/**
 *
 * @param expiredTime (seconds)
 * @returns
 */
export const loginExpired = (expiredTime: number): boolean =>
  expiredTime - getCurrentTimeSeconds() < 0;

export const convertTimeStampToTime = (value: string) =>
  dayjs(value).format('H:m:s');

export const convertTimeMessage = (value: number) =>
  dayjs.unix(value).format('HH:mm A');

export const convertDateToTime = (value: string) => {
  const minutes = 60 * 1000;
  const hours = minutes * 60;
  const days = hours * 24;
  const months = days * 30;
  const years = days * 365;

  const date = new Date(value).getTime();
  const elapsed = Date.now() - date;

  let result;

  switch (true) {
    case elapsed < minutes:
      result = 'Just now';
      break;
    case elapsed < hours:
      result = Math.round(elapsed / minutes) + ' minutes ago';
      break;
    case elapsed < days:
      result = Math.round(elapsed / hours) + ' hours ago';
      break;
    case elapsed < months:
      result = Math.round(elapsed / days) + ' days ago';
      break;
    case elapsed < years:
      result = Math.round(elapsed / months) + ' months ago';
      break;
    default:
      result = Math.round(elapsed / years) + ' years ago';
      break;
  }

  return result;
};
