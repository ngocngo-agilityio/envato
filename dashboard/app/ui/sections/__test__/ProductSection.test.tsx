// Libs
import { fireEvent } from '@testing-library/react';

// Utils
import { renderQueryProviderTest } from '@/lib/utils/testUtils';

// Sections
import Products from '../Products';

// Mocks
import {
  MOCK_UPDATE_PRODUCT_PAYLOAD,
  PRODUCTS,
  MOCK_ADD_PRODUCT_PAYLOAD,
  MOCK_IMAGE_FILES,
  MOCK_UPLOAD_IMAGE_RES_SUCCESS,
} from '@/lib/mocks';

// Hooks
import {
  useAuth,
  useGetUserDetails,
  useMoney,
  usePinCode,
  useProducts,
  useSearch,
  useUploadImages,
  useUploadProductImageFiles,
  useWallet,
} from '@/lib/hooks';

// Constants
import {
  DEBOUNCE_TIME,
  ERROR_MESSAGES,
  PAGINATION,
  SUCCESS_MESSAGES,
} from '@/lib/constants';

jest.mock('@/lib/hooks', () => ({
  ...jest.requireActual('@/lib/hooks'),
  useSearch: jest.fn(),
  useProducts: jest.fn(),
  useUploadImages: jest.fn(),
  useAuth: jest.fn(),
  useMoney: jest.fn(),
  useGetUserDetails: jest.fn(),
  usePinCode: jest.fn(),
  useWallet: jest.fn(),
  useUploadProductImageFiles: jest.fn(),
}));

describe('Product section', () => {
  const resetPageMock = jest.fn();
  const setLimitMock = jest.fn();
  const getMock = jest.fn();
  const setSearchParamMock = jest.fn();
  const uploadImagesMock = jest.fn();

  beforeEach(() => {
    (useSearch as jest.Mock).mockReturnValue({
      get: getMock,
      setSearchParam: setSearchParamMock,
    });

    (useProducts as jest.Mock).mockReturnValue({
      products: PRODUCTS,
      resetPage: resetPageMock,
      setLimit: setLimitMock,
    });

    (useUploadImages as jest.Mock).mockReturnValue({
      uploadImages: uploadImagesMock,
      isPending: false,
    });

    (useAuth as jest.Mock).mockReturnValue({ setUser: jest.fn() });

    (useMoney as jest.Mock).mockReturnValue({
      sendMoneyToUserWallet: jest.fn(),
      isSendMoneySubmitting: false,
    });

    (useGetUserDetails as jest.Mock).mockReturnValue({ filterDataUser: [] });

    (usePinCode as jest.Mock).mockReturnValue({});

    (useWallet as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('Should render match with snapshot.', () => {
    const { container } = renderQueryProviderTest(<Products />);

    expect(container).toMatchSnapshot();
  });

  it('should call setLimitMock when selecting limit', () => {
    const { getByText } = renderQueryProviderTest(<Products />);

    act(() => {
      fireEvent.click(getByText(PAGINATION[1].label));
    });

    expect(setLimitMock).toHaveBeenCalledWith(+PAGINATION[1].value);
  });

  it('should call resetPageMock when user search product', () => {
    jest.useFakeTimers();
    const searchValue = 'Shoe';

    const { getByPlaceholderText } = renderQueryProviderTest(<Products />);

    act(() => {
      const searchInput = getByPlaceholderText('Search by name');
      fireEvent.change(searchInput, { target: { value: searchValue } });
    });

    jest.advanceTimersByTime(DEBOUNCE_TIME);

    expect(resetPageMock).toHaveBeenCalled();
  });

  it('should delete product successfully', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: PRODUCTS,
      deleteProduct: jest.fn((_, { onSuccess }) => onSuccess()),
    });

    const { getAllByTestId, getByText, getByRole } = renderQueryProviderTest(
      <Products />,
    );

    act(() => {
      fireEvent.click(getAllByTestId('del-icon')[0]);
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Delete' }));
    });

    waitFor(() =>
      expect(
        getByText(SUCCESS_MESSAGES.DELETE_PRODUCT_SUCCESS.title),
      ).toBeInTheDocument(),
    );
  });

  it('should delete product failed', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: PRODUCTS,
      deleteProduct: jest.fn((_, { onError }) => onError()),
    });

    const { getAllByTestId, getByText, getByRole } = renderQueryProviderTest(
      <Products />,
    );

    act(() => {
      fireEvent.click(getAllByTestId('del-icon')[0]);
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Delete' }));
    });

    waitFor(() =>
      expect(
        getByText(ERROR_MESSAGES.DELETE_PRODUCT_FAIL.title),
      ).toBeInTheDocument(),
    );
  });

  it('should update product successfully', () => {
    (useUploadProductImageFiles as jest.Mock).mockReturnValue({
      getRootProps: jest.fn(),
      getInputProps: jest.fn(),
      imageFiles: MOCK_IMAGE_FILES,
    });

    (useUploadImages as jest.Mock).mockReturnValue({
      uploadImages: jest.fn((_, { onSuccess }) =>
        onSuccess(MOCK_UPLOAD_IMAGE_RES_SUCCESS.data),
      ),
    });

    (useProducts as jest.Mock).mockReturnValue({
      products: PRODUCTS,
      updateProduct: jest.fn((_, { onSuccess }) => onSuccess()),
    });

    const { getAllByTestId, getByText, getByRole, getByLabelText } =
      renderQueryProviderTest(<Products />);

    act(() => {
      fireEvent.click(getAllByTestId('edit-icon')[0]);
    });

    act(() => {
      fireEvent.change(getByLabelText('Name'), {
        target: { value: 'Update name' },
      });
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Save' }));
    });

    waitFor(() =>
      expect(
        getByText(SUCCESS_MESSAGES.UPDATE_PRODUCT_SUCCESS.title),
      ).toBeInTheDocument(),
    );
  });

  it('should update product failed', () => {
    (useUploadProductImageFiles as jest.Mock).mockReturnValue({
      getRootProps: jest.fn(),
      getInputProps: jest.fn(),
      imageFiles: MOCK_IMAGE_FILES,
    });

    (useUploadImages as jest.Mock).mockReturnValue({
      uploadImages: jest.fn((_, { onSuccess }) => onSuccess([null])),
    });

    (useProducts as jest.Mock).mockReturnValue({
      products: PRODUCTS,
      updateProduct: jest.fn((_, { onError }) => onError()),
    });

    const { getAllByTestId, getByText, getByRole, getByLabelText } =
      renderQueryProviderTest(<Products />);

    act(() => {
      fireEvent.click(getAllByTestId('edit-icon')[0]);
    });

    act(() => {
      fireEvent.change(getByLabelText('Name'), {
        target: { value: 'Update name' },
      });
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Save' }));
    });

    waitFor(() =>
      expect(
        getByText(ERROR_MESSAGES.UPDATE_PRODUCT_FAIL.title),
      ).toBeInTheDocument(),
    );
  });

  it('should update product image failed', () => {
    (useUploadProductImageFiles as jest.Mock).mockReturnValue({
      getRootProps: jest.fn(),
      getInputProps: jest.fn(),
      imageFiles: MOCK_IMAGE_FILES,
    });

    (useUploadImages as jest.Mock).mockReturnValue({
      uploadImages: jest.fn((_, { onError }) => onError()),
    });

    const { getAllByTestId, getByText, getByRole, getByLabelText } =
      renderQueryProviderTest(<Products />);

    act(() => {
      fireEvent.click(getAllByTestId('edit-icon')[0]);
    });

    act(() => {
      fireEvent.change(getByLabelText('Name'), {
        target: { value: MOCK_UPDATE_PRODUCT_PAYLOAD.name },
      });
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Save' }));
    });

    waitFor(() =>
      expect(
        getByText(ERROR_MESSAGES.UPDATE_PRODUCT_FAIL.title),
      ).toBeInTheDocument(),
    );
  });

  it('should create product successfully', () => {
    (useUploadProductImageFiles as jest.Mock).mockReturnValue({
      getRootProps: jest.fn(),
      getInputProps: jest.fn(),
      imageFiles: [],
    });

    (useUploadImages as jest.Mock).mockReturnValue({
      uploadImages: jest.fn((_, { onSuccess }) => onSuccess()),
    });

    (useProducts as jest.Mock).mockReturnValue({
      products: PRODUCTS,
      createProduct: jest.fn((_, { onSuccess }) => onSuccess()),
    });

    const { getByText, getByRole, getByLabelText } = renderQueryProviderTest(
      <Products />,
    );

    act(() => {
      fireEvent.click(getByText('Add Product'));
    });

    act(() => {
      fireEvent.change(getByLabelText('Name'), {
        target: { value: MOCK_ADD_PRODUCT_PAYLOAD.name },
      });

      fireEvent.change(getByLabelText('Price'), {
        target: { value: MOCK_ADD_PRODUCT_PAYLOAD.amount },
      });

      fireEvent.change(getByLabelText('Quantity'), {
        target: { value: MOCK_ADD_PRODUCT_PAYLOAD.stock },
      });
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Save' }));
    });

    waitFor(() =>
      expect(
        getByText(SUCCESS_MESSAGES.CREATE_PRODUCT_SUCCESS.title),
      ).toBeInTheDocument(),
    );
  });

  it('should create product failed', () => {
    (useUploadProductImageFiles as jest.Mock).mockReturnValue({
      getRootProps: jest.fn(),
      getInputProps: jest.fn(),
      imageFiles: [],
    });

    (useUploadImages as jest.Mock).mockReturnValue({
      uploadImages: jest.fn((_, { onSuccess }) => onSuccess()),
    });

    (useProducts as jest.Mock).mockReturnValue({
      products: PRODUCTS,
      createProduct: jest.fn((_, { onError }) => onError()),
    });

    const { getByText, getByRole, getByLabelText } = renderQueryProviderTest(
      <Products />,
    );

    act(() => {
      fireEvent.click(getByText('Add Product'));
    });

    act(() => {
      fireEvent.change(getByLabelText('Name'), {
        target: { value: MOCK_ADD_PRODUCT_PAYLOAD.name },
      });

      fireEvent.change(getByLabelText('Price'), {
        target: { value: MOCK_ADD_PRODUCT_PAYLOAD.amount },
      });

      fireEvent.change(getByLabelText('Quantity'), {
        target: { value: MOCK_ADD_PRODUCT_PAYLOAD.stock },
      });
    });

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Save' }));
    });

    waitFor(() =>
      expect(
        getByText(ERROR_MESSAGES.CREATE_PRODUCT_FAIL.title),
      ).toBeInTheDocument(),
    );
  });
});
