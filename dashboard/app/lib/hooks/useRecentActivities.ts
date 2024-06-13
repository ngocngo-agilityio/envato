import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

// Constants
import { END_POINTS, PAGE_SIZE, TIME_DETAIL_FORMAT } from '@/lib/constants';

// Store
import { authStore } from '../stores';

// Services
import { mainHttpService } from '@/lib/services';

// Utils
import { formatPageArray, handleSort } from '@/lib/utils';

// Interface
import { SortType, TRecentActivities } from '@/lib/interfaces';

export type TAction = {
  actionName: string;
  email?: string;
};

export type TActivity = {
  result: Array<TRecentActivities>;
  totalPage: number;
};

export type TActivitiesSortField = 'actionName' | 'email' | 'date';
type TSort = {
  field: TActivitiesSortField | '';
  type: SortType;
};
export type TActivitiesSortHandler = (field: TActivitiesSortField) => void;

export const useRecentActivities = (queryParam?: TAction) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const userId = authStore((state) => state.user?.id);

  const { actionName: searchActionName, email: searchEmail }: TAction =
    Object.assign(
      {
        actionName: '',
        email: '',
      },
      queryParam,
    );

  const sortType: Record<SortType, SortType> = useMemo(
    () => ({
      desc: SortType.ASC,
      asc: SortType.DESC,
    }),
    [],
  );

  const [sortValue, setSortValue] = useState<TSort>({
    field: '',
    type: SortType.ASC,
  });

  const { data, ...query } = useQuery<{ data: TActivity }>({
    queryKey: [
      END_POINTS.RECENT_ACTIVITIES,
      searchActionName,
      searchEmail,
      currentPage,
      limit,
    ],
    queryFn: ({ signal }) =>
      mainHttpService.get({
        path: END_POINTS.RECENT_ACTIVITIES,
        userId,
        page: currentPage,
        limit,
        configs: { signal },
      }),
  });

  const activitiesData: TRecentActivities[] = data?.data.result || [];
  const totalPage = data?.data.totalPage as number;

  const arrOfCurrButtons: string[] = Array.from(
    { length: totalPage },
    (_, index) => index.toString(),
  );

  const pageArray = formatPageArray({
    totalPage,
    currentPage,
    arrOfCurrButtons,
  });

  const isDisableNext = currentPage === totalPage || currentPage < 1;

  const isDisablePrev = currentPage <= 1;

  const resetPage = useCallback(() => setCurrentPage(1), []);

  // sort activitiesSorted
  const activitiesAfterSort: TRecentActivities[] =
    useMemo((): TRecentActivities[] => {
      const tempActivities: TRecentActivities[] = [...activitiesData];
      const { field, type } = sortValue;

      if (!field) return activitiesData;

      tempActivities.sort(
        (
          {
            actionName: prevActivitiesName,
            email: prevEmail,
            createdAt: prevCreatedAt,
          }: TRecentActivities,
          {
            actionName: nextActivitiesName,
            email: nextEmail,
            createdAt: nextCreatedAt,
          }: TRecentActivities,
        ) => {
          const valueForField: Record<TActivitiesSortField, number> = {
            actionName: handleSort(
              type,
              prevActivitiesName,
              nextActivitiesName,
            ),
            email: handleSort(type, prevEmail, nextEmail),
            date: handleSort(
              type,
              dayjs(prevCreatedAt).format(TIME_DETAIL_FORMAT),
              dayjs(nextCreatedAt).format(TIME_DETAIL_FORMAT),
            ),
          };

          return valueForField[field] ?? 0;
        },
      );

      return tempActivities;
    }, [activitiesData, sortValue]);

  /**
   * TODO: Since the API is imprecise we will use this method for now.
   * TODO: Will be removed in the future and will use queryKey for re-fetching
   */
  const activities: TRecentActivities[] = useMemo((): TRecentActivities[] => {
    const isNameMatchWith = (target = ''): boolean =>
      target.trim().toLowerCase().includes(searchActionName);

    return activitiesAfterSort.filter(
      ({ actionName, email }: TRecentActivities) => {
        const isMatchWithName: boolean = isNameMatchWith(actionName);
        const isMatchWithEmail: boolean = isNameMatchWith(email);

        return isMatchWithName || isMatchWithEmail;
      },
    );
  }, [activitiesAfterSort, searchActionName]);

  const sortBy: TActivitiesSortHandler = useCallback(
    (field: TActivitiesSortField) => {
      setSortValue((prev) => ({
        field: field,
        type: sortType[prev.type],
      }));
    },
    [sortType],
  );

  return {
    ...query,
    limit,
    activities,
    data: activities,
    pageArray,
    currentPage,
    isDisableNext,
    isDisablePrev,
    sortBy,
    setCurrentPage,
    setLimit,
    resetPage,
  };
};
