// Utils
import { renderQueryProviderTest } from '@/lib/utils/testUtils';

// Pages
import Calendar from '../calendar/page';

describe('Calendar render', () => {
  test('Should render match with snapshot.', () => {
    const { container } = renderQueryProviderTest(<Calendar />);

    expect(container).toMatchSnapshot();
  });
});
