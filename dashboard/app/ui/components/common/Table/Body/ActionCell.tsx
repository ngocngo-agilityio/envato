'use client';

import dynamic from 'next/dynamic';
import { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';

// Components
import {
  Dot,
  Modal,
  ProductForm,
  ConfirmDeleteModalBody,
} from '@/ui/components';

const TransactionModal = dynamic(
  () => import('@/ui/components/common/Table/Body/TransactionModal'),
);

// Interfaces
import {
  TProductRequest,
  TProductResponse,
  TRecentActivities,
  TTransaction,
  TUserDetail,
} from '@/lib/interfaces';

interface ActionCallProps {
  user?: TUserDetail;
  transaction?: TTransaction;
  product?: TProductResponse;
  itemName?: string;
  activities?: TRecentActivities;
  titleDelete?: string;
  isOpenModal?: boolean;
  isOpenUserAction?: boolean;
  onDeleteTransaction?: (transactionData: TTransaction) => void;
  onUpdateTransaction?: (transactionData: TTransaction) => void;
  onDeleteProduct?: (id: string) => void;
  onUpdateProduct?: (product: TProductRequest, imageFiles: File[]) => void;
  onDeleteActivity?: (
    activitiesData: Partial<
      TRecentActivities & { userId: string; activitiesId: string }
    >,
  ) => void;
  onLockUser?: (userData?: TUserDetail) => void;
  onUnlockUser?: (userData?: TUserDetail) => void;
}

const ActionCellComponent = ({
  user,
  product,
  itemName,
  transaction,
  titleDelete,
  activities,
  isOpenModal = false,
  isOpenUserAction = false,
  onLockUser,
  onUnlockUser,
  onDeleteTransaction,
  onDeleteActivity,
  onDeleteProduct,
  onUpdateProduct,
  onUpdateTransaction,
}: ActionCallProps) => {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const customerId = transaction?.customer.customerId || activities?._id;
  const optionDelete = product || activities;

  const { _id: productId = '' } = product || {};

  const handleOpenConfirmModal = useCallback(
    (isDeleteModal: boolean) => () => {
      setIsOpenConfirmModal(true);
      setIsDelete(isDeleteModal);
    },
    [],
  );

  const handleToggleModal = useCallback(() => {
    setIsOpenConfirmModal(!isOpenConfirmModal);
  }, [isOpenConfirmModal]);

  const handleDeleteTransaction = useCallback(() => {
    handleToggleModal();
    onDeleteTransaction && onDeleteTransaction(transaction as TTransaction);
  }, [handleToggleModal, onDeleteTransaction, transaction]);

  const handleDeleteProduct = useCallback(() => {
    handleToggleModal();
    onDeleteProduct && onDeleteProduct(productId);
  }, [handleToggleModal, onDeleteProduct, productId]);

  const handleDeleteActivities = useCallback(() => {
    handleToggleModal();
    onDeleteActivity &&
      onDeleteActivity(
        activities as Partial<
          TRecentActivities & { userId: string; activitiesId: string }
        >,
      );
  }, [handleToggleModal, onDeleteActivity, activities]);

  const handleLockUser = useCallback(
    () => onLockUser && onLockUser(user),
    [onLockUser, user],
  );

  const handleUnLockUser = useCallback(
    () => onUnlockUser && onUnlockUser(user),
    [onUnlockUser, user],
  );

  return (
    <>
      <Td
        px={5}
        fontSize="md"
        color="text.primary"
        fontWeight="semibold"
        textAlign="center"
        position="relative"
      >
        <Menu closeOnSelect={false}>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                isActive={isOpen}
                p={0}
                bg="none"
                _hover={{
                  bg: 'none',
                }}
                _active={{
                  bg: 'none',
                }}
              >
                <IconButton
                  aria-label="This is the icon action"
                  w={7}
                  h={7}
                  bgColor="transparent"
                  _hover={{
                    bgColor: 'transparent',
                  }}
                  data-testid="dot-icon"
                >
                  <Dot />
                </IconButton>
              </MenuButton>
              {isOpenModal && (
                <MenuList border="none" mt="-2.5" bg="transparent" minW={65}>
                  <MenuItem bg="transparent">
                    <Flex
                      position="absolute"
                      right={4}
                      minW={12}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {isOpenUserAction ? (
                        <>
                          {user?.isBlock ? (
                            <UnlockIcon
                              ml={3}
                              w={5}
                              h={5}
                              onClick={handleUnLockUser}
                              data-testid="lock-unlock-icon"
                            />
                          ) : (
                            <LockIcon
                              ml={3}
                              w={5}
                              h={5}
                              onClick={handleLockUser}
                              data-testid="lock-unlock-icon"
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {!customerId && (
                            <EditIcon
                              w={5}
                              h={5}
                              onClick={handleOpenConfirmModal(false)}
                              data-testid="edit-icon"
                            />
                          )}
                          <DeleteIcon
                            ml={customerId ? 4 : 0}
                            w={5}
                            h={5}
                            onClick={handleOpenConfirmModal(true)}
                            data-testid="del-icon"
                          />
                        </>
                      )}
                    </Flex>
                  </MenuItem>
                </MenuList>
              )}
            </>
          )}
        </Menu>
      </Td>
      {isOpenConfirmModal && transaction && (
        <Modal
          isOpen={isOpenConfirmModal}
          onClose={handleToggleModal}
          title={isDelete ? 'Delete transaction' : 'Update transaction'}
          body={
            <TransactionModal
              isDelete={isDelete}
              transaction={transaction}
              onDeleteTransaction={handleDeleteTransaction}
              onUpdateTransaction={onUpdateTransaction}
              onCloseModal={handleToggleModal}
            />
          }
          haveCloseButton
        />
      )}

      {isOpenConfirmModal && isDelete && optionDelete && (
        <Modal
          isOpen={isOpenConfirmModal}
          onClose={handleToggleModal}
          title={titleDelete}
          body={
            <ConfirmDeleteModalBody
              itemName={itemName}
              onDelete={product ? handleDeleteProduct : handleDeleteActivities}
              onCancel={handleToggleModal}
            />
          }
          haveCloseButton
        />
      )}

      {isOpenConfirmModal && !isDelete && product && (
        <Modal
          isOpen={isOpenConfirmModal}
          onClose={handleToggleModal}
          title="Update Product"
          body={
            <ProductForm
              data={product}
              onSubmit={onUpdateProduct}
              onCloseModal={handleToggleModal}
            />
          }
          haveCloseButton
        />
      )}
    </>
  );
};

const ActionCell = memo(ActionCellComponent, isEqual);

export default ActionCell;
