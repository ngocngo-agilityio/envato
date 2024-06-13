// Types
import {
  TDataSource,
  TProduct,
  TProductResponse,
  TRecentActivities,
  TTransaction,
} from '../interfaces';

export const COLUMNS_DASHBOARD = (
  onRenderHead: (title: string, key: string) => void,
  onRenderBody: ({ id, image, name }: TDataSource) => void,
  onRenderEmail: (email: TTransaction) => void,
  onRenderLocation: (location: TTransaction) => void,
  onRenderSpent: (spent: TTransaction) => void,
  onRenderRole: (role: TTransaction) => void,
  onRenderActionIcon: (data: TTransaction) => void,
) => [
  {
    title: 'Customer name',
    key: 'name',
    renderHead: onRenderHead,
    renderBody: onRenderBody,
  },
  {
    title: 'Email',
    key: 'email',
    renderHead: onRenderHead,
    renderBody: onRenderEmail,
  },
  {
    title: 'Location',
    key: 'location',
    renderHead: onRenderHead,
    renderBody: onRenderLocation,
  },
  {
    title: 'Spent',
    key: 'spent',
    renderHead: onRenderHead,
    renderBody: onRenderSpent,
  },
  {
    title: 'Role',
    key: 'role',
    renderHead: onRenderHead,
    renderBody: onRenderRole,
  },
  {
    title: '',
    key: 'action',
    renderBody: onRenderActionIcon,
    renderHead: onRenderHead,
  },
];

export const COLUMNS_HISTORY = (
  renderHead: (title: string, key: string) => void,
  renderBody: ({ id, image, name }: TDataSource) => void,
  renderPaymentStatus: ({ paymentStatus }: TDataSource) => void,
  renderTransactionStatus: ({ paymentStatus }: TDataSource) => void,
  renderSpent: (spent: TTransaction) => void,
) => [
  {
    title: 'Customer name',
    key: 'name',
    renderHead: renderHead,
    renderBody: renderBody,
  },
  {
    title: 'Date',
    key: 'date',
    renderHead: renderHead,
  },
  {
    title: 'Amount',
    key: 'spent',
    renderHead: renderHead,
    renderBody: renderSpent,
  },
  {
    title: 'Payment',
    key: 'paymentStatus',
    renderHead: renderHead,
    renderBody: renderPaymentStatus,
  },
  {
    title: 'Status',
    key: 'transactionStatus',
    renderHead: renderHead,
    renderBody: renderTransactionStatus,
  },
];

export const COLUMNS_PRODUCTS = (
  onRenderHead: (title: string, key: string) => void,
  onRenderBody: ({ id, name }: TDataSource) => void,
  onRenderGallery: ({ imageURLs, name }: TProduct) => void,
  onRenderPrice: (amount: TProduct) => void,
  onRenderStatus: (productStatus: TDataSource) => void,
  onRenderQuantity: (stock: TProduct) => void,
  onRenderActionIcon: (data: TProductResponse) => void,
) => [
  {
    title: 'Product Name',
    key: 'name',
    renderHead: onRenderHead,
    renderBody: onRenderBody,
  },
  {
    title: 'Gallery Thumbnail',
    key: 'imageURLs',
    renderHead: onRenderHead,
    renderBody: onRenderGallery,
  },
  {
    title: 'Price',
    key: 'price',
    renderHead: onRenderHead,
    renderBody: onRenderPrice,
  },
  {
    title: 'Status',
    key: 'productStatus',
    renderHead: onRenderHead,
    renderBody: onRenderStatus,
  },
  {
    title: 'Quantity',
    key: 'quantity',
    renderHead: onRenderHead,
    renderBody: onRenderQuantity,
  },
  {
    title: 'Date',
    key: 'date',
    renderHead: onRenderHead,
  },
  {
    title: '',
    key: 'action',
    renderBody: onRenderActionIcon,
    renderHead: onRenderHead,
  },
];

export const COLUMNS_RECENT_ACTIVITIES = (
  onRenderHead: (title: string, key: string) => void,
  onRenderBody: ({ id, actionName }: TDataSource) => void,
  onRenderName: (actionName: TRecentActivities) => void,
  onRenderEmail: (email: TRecentActivities) => void,
) => [
  {
    title: 'ID Action',
    key: '_id',
    renderHead: onRenderHead,
    renderBody: onRenderBody,
  },
  {
    title: 'Action Name',
    key: 'actionName',
    renderHead: onRenderHead,
    renderBody: onRenderName,
  },
  {
    title: 'Email',
    key: 'email',
    renderHead: onRenderHead,
    renderBody: onRenderEmail,
  },
  {
    title: 'Date',
    key: 'date',
    renderHead: onRenderHead,
  },
];
