// Constants
import { STATISTICAL_API } from '@/lib/constants';

// Services
import { HttpClientWithFetch } from '@/lib/services';

export const mainHttpServiceWithFetch = new HttpClientWithFetch(
  STATISTICAL_API,
);
