// Libs
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

// Types
import { TProduct, TProductRequest } from '@/lib/interfaces';

// Constants
import { PRODUCT_STATUS } from '@/lib/constants';

export const PRODUCTS: TProduct[] = [
  {
    _id: '65f174cd481c27ff30bc7886',
    name: 'ban phim',
    imageURLs: [
      'https://i.ibb.co/sC4FyPz/ban-phim-co-gaming-sidotech-yindiao-k100-jpg-1659689824-05082022155704.jpg',
    ],
    description: 'ban phim',
    stock: 1,
    currency: '$',
    amount: 100,
    createdAt: '2024-03-13T09:41:33.811Z',
    productStatus: PRODUCT_STATUS.IN_STOCK,
  },
  {
    _id: '65f174b0481c27ff30bc7883',
    name: 'tay cam xbox',
    imageURLs: [
      'https://i.ibb.co/pwH6GTk/png-clipart-playstation-3-playstation-2-gamepad-directinput-gamepad-game-electronics.png',
    ],
    description: 'tay cam',
    stock: 0,
    currency: '$',
    amount: 123,
    createdAt: '2024-03-13T09:41:04.609Z',
    productStatus: PRODUCT_STATUS.IN_STOCK,
  },
  {
    _id: '65f02ee5b31d51cdd5b5d34e',
    name: 'tay cam 3',
    imageURLs: [
      'https://i.ibb.co/3yzTC5Q/image-57.png',
      'https://i.ibb.co/Hq9kqmc/image-58.png',
      'https://i.ibb.co/YdnfHMf/image-63.png',
    ],
    description: 'note',
    stock: 2,
    currency: '$',
    amount: 111,
    createdAt: '2024-03-12T10:31:01.199Z',
    productStatus: PRODUCT_STATUS.IN_STOCK,
  },
  {
    _id: '65eff99138b174f345832cb4',
    name: 'envato market',
    imageURLs: [
      'https://i.ibb.co/vxCVqcz/image-59.png',
      'https://i.ibb.co/d0D0csn/image-61.png',
    ],
    description: 'note',
    stock: 4,
    currency: '$',
    amount: 111,
    createdAt: '2024-03-12T06:43:29.849Z',
    productStatus: PRODUCT_STATUS.IN_STOCK,
  },
  {
    _id: '65efd2ea8f5954ecf024d4aa',
    name: 'tay cam 2',
    imageURLs: [
      'https://i.ibb.co/d0D0csn/image-61.png',
      'https://i.ibb.co/vxCVqcz/image-59.png',
    ],
    description: 'note',
    stock: 0,
    currency: '$',
    amount: 1111,
    createdAt: '2024-03-12T03:58:34.429Z',
    productStatus: PRODUCT_STATUS.IN_STOCK,
  },
];

export const MOCK_PRODUCTS_SUCCESS_RES = {
  data: { result: PRODUCTS, totalPage: 3 },
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {
    headers: {} as AxiosRequestHeaders,
  },
};

export const MOCK_ADD_PRODUCT_PAYLOAD: Omit<TProductRequest, '_id'> = {
  amount: '1',
  currency: '$',
  description: '',
  imageURLs: ['https://i.ibb.co/xXd07BD/Img-01.png'],
  name: 'Shoe',
  stock: '2',
};

export const MOCK_ADD_PRODUCT_RES: AxiosResponse = {
  data: 'success',
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {
    headers: {} as AxiosRequestHeaders,
    data: {
      ...MOCK_ADD_PRODUCT_PAYLOAD,
      id: '1',
    },
  },
};

export const MOCK_DELETE_PRODUCT_PAYLOAD = {
  productId: PRODUCTS[0]._id,
};

export const MOCK_UPDATE_PRODUCT_PAYLOAD = {
  name: 'Update name',
  productId: PRODUCTS[0]._id,
};

export const MOCK_ADD_PRODUCT_SUCCESS_RES = {
  data: {
    config: { data: PRODUCTS[0] },
  },
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {
    headers: {} as AxiosRequestHeaders,
  },
};

export const MOCK_IMAGE_FILES = [
  new File(['Shoe'], './shoe.png', { type: 'image/png' }),
];

export const MOCK_UPLOAD_IMAGE_RES_SUCCESS: AxiosResponse = {
  data: [{ data: { data: { url: 'https://i.ibb.co/xXd07BD/Img-01.png' } } }],
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {
    headers: {} as AxiosRequestHeaders,
  },
};
