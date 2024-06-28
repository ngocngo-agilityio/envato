// Libs
import { render, fireEvent } from '@testing-library/react';

// Components
import ProductsTable from '..';

// Constants
import { DEBOUNCE_TIME, PAGINATION } from '@/lib/constants';

// Mocks
import { PRODUCTS } from '@/lib/mocks';

describe('ProductForm component', () => {
  const mockProps = {
    isFetching: false,
    products: PRODUCTS,
    limit: 10,
    currentPage: 2,
    isDisableNext: false,
    isDisablePrev: false,
    pageArray: ['1', '2', '3'],
    isLoading: false,
    searchValue: '',
    onSort: jest.fn(),
    onSearch: jest.fn(),
    onChangeLimit: jest.fn(),
    onChangePage: jest.fn(),
    onSubmitProductForm: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match with snapshot', () => {
    const { container } = render(<ProductsTable {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('should call onChangeLimit when selecting limit ', () => {
    const { getByText } = render(<ProductsTable {...mockProps} />);

    fireEvent.click(getByText(PAGINATION[1].label));

    expect(mockProps.onChangeLimit).toHaveBeenCalledWith(+PAGINATION[1].value);
  });

  it('should call onChangePage when clicking on NEXT button ', () => {
    const { getByTestId } = render(<ProductsTable {...mockProps} />);

    fireEvent.click(getByTestId('next-button'));

    expect(mockProps.onChangePage).toHaveBeenCalledWith(
      mockProps.currentPage + 1,
    );
  });

  it('should call onChangePage when clicking PREV button ', () => {
    const { getByTestId } = render(<ProductsTable {...mockProps} />);

    fireEvent.click(getByTestId('prev-button'));

    expect(mockProps.onChangePage).toHaveBeenCalledWith(
      mockProps.currentPage - 1,
    );
  });

  it('should call onSearch when user search product', () => {
    jest.useFakeTimers();
    const searchValue = 'Shoe';
    const { getByPlaceholderText } = render(<ProductsTable {...mockProps} />);

    const searchInput = getByPlaceholderText('Search by name');
    fireEvent.change(searchInput, { target: { value: searchValue } });

    jest.advanceTimersByTime(DEBOUNCE_TIME);

    expect(mockProps.onSearch).toHaveBeenCalledWith(searchValue);
  });
});
