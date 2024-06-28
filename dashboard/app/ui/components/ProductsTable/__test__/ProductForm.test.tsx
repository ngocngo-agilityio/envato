// Libs
import { render, fireEvent } from '@testing-library/react';

// Components
import ProductForm from '../ProductForm';

describe('ProductForm component', () => {
  const mockProps = {
    onCloseModal: jest.fn(),
    onSubmit: jest.fn(),
  };

  it('should match with snapshot', () => {
    const { container } = render(<ProductForm {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('should call onSubmit when submit form', async () => {
    const mockNewProductData = {
      name: 'Shoe',
      price: 10,
      quantity: 5,
    };

    const { getByLabelText, getByRole } = render(
      <ProductForm {...mockProps} />,
    );

    act(() => {
      fireEvent.change(getByLabelText('Name'), {
        target: { value: mockNewProductData.name },
      });
      fireEvent.change(getByLabelText('Price'), {
        target: { value: mockNewProductData.price },
      });
      fireEvent.change(getByLabelText('Price'), { target: { value: 'd' } });
      fireEvent.change(getByLabelText('Quantity'), {
        target: { value: mockNewProductData.quantity },
      });
      fireEvent.change(getByLabelText('Quantity'), { target: { value: 'd' } });
    });

    const saveBtn = getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(mockNewProductData, []);
      expect(mockProps.onCloseModal).toHaveBeenCalled();
    });
  });
});
