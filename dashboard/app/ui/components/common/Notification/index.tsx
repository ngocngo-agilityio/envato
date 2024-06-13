'use client';

import { memo, useCallback, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useToast,
} from '@chakra-ui/react';
import isEqual from 'react-fast-compare';

// Components
import { Bell, IconButton, Modal, Indicator } from '@/ui/components';
import { NotificationItem } from './Body';

// Constants
import {
  CONFIRM_MESSAGE,
  ERROR_MESSAGES,
  STATUS,
  SUCCESS_MESSAGES,
  TYPE,
} from '@/lib/constants';

// Hooks
import { useNotification } from '@/lib/hooks';

// Utils
import { customToast } from '@/lib/utils/toast';

// Interfaces
import { TNotification, TUserDetail } from '@/lib/interfaces';

interface NotificationProps {
  colorFill: string;
  user: TUserDetail;
}

type TModalContentProps = {
  isDeleteNotification: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

const ModalContent = ({
  isDeleteNotification,
  onDelete,
  onCancel,
}: TModalContentProps): JSX.Element => (
  <Box>
    <Text fontSize="lg">{CONFIRM_MESSAGE.DELETE_NOTIFICATION}</Text>
    <Flex my={4} justifyContent="center">
      <Button
        w={44}
        bg="green.600"
        mr={3}
        isDisabled={isDeleteNotification}
        onClick={onDelete}
      >
        Delete
      </Button>
      <Button
        w={44}
        bg="orange.300"
        _hover={{ bg: 'orange.400' }}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Flex>
  </Box>
);

const ModalContentMemorized = memo(ModalContent);

const Notification = ({ colorFill, user }: NotificationProps) => {
  const toast = useToast();

  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [currentNotificationId, setCurrentNotificationId] =
    useState<string>('');

  const handleToggleModal = useCallback(
    (event?: React.MouseEvent<SVGElement, MouseEvent>, id?: string) => {
      event?.stopPropagation();
      setCurrentNotificationId(id as string);
      setIsOpenConfirmModal(!isOpenConfirmModal);
    },
    [isOpenConfirmModal],
  );

  const {
    notificationData,
    quantity,
    hasNewNotification,
    isDeleteNotification,
    deleteNotification,
    updateNotification,
  } = useNotification(user?.id);

  const handleUpdateNotification = useCallback(
    (updateData: TNotification) =>
      updateNotification({
        userId: user?.id,
        notificationId: updateData._id,
        isMarkAsRead: true,
      }),
    [updateNotification, user?.id],
  );

  const handleDeleteNotification = useCallback(
    (id?: string) => {
      handleToggleModal();
      deleteNotification(
        {
          userId: user?.id,
          notificationId: id,
        },
        {
          onSuccess: () => {
            handleToggleModal();
            toast(
              customToast(
                SUCCESS_MESSAGES.DELETE_NOTIFICATION_SUCCESS.title,
                SUCCESS_MESSAGES.DELETE_NOTIFICATION_SUCCESS.description,
                STATUS.SUCCESS,
              ),
            );
          },
          onError: () =>
            toast(
              customToast(
                ERROR_MESSAGES.DELETE_NOTIFICATION.title,
                ERROR_MESSAGES.DELETE_NOTIFICATION.description,
                STATUS.ERROR,
              ),
            ),
        },
      );
    },
    [deleteNotification, handleToggleModal, toast, user?.id],
  );

  const handleDeleteData = () =>
    handleDeleteNotification(currentNotificationId);

  return (
    <Indicator isOpen={isDeleteNotification}>
      <Menu placement="auto" closeOnSelect={false}>
        {({ isOpen }) => (
          <Box>
            <MenuButton
              as={Button}
              p={0}
              bg="none"
              _hover={{
                bg: 'none',
              }}
              _active={{
                bg: 'none',
              }}
              data-testid="click-menu-button"
              isActive={isOpen}
              lineHeight="inherit"
            >
              <IconButton
                ariaLabel="new-notification"
                hasNewNotification={hasNewNotification}
                quantityNotification={quantity}
              >
                <Bell color={colorFill} />
              </IconButton>
            </MenuButton>
            <MenuList
              mt={5}
              w={{ base: 300, lg: 435 }}
              overflow="hidden"
              px={3.5}
              border="none"
              borderRadius="lg"
              bg="background.component.primary"
            >
              <Text fontSize="xl" fontWeight="bold" m={4}>
                Notifications
              </Text>
              <Flex
                flexDirection="column"
                mt={3}
                maxH={320}
                overflowY="scroll"
                css={{
                  '&::-webkit-scrollbar': {
                    width: 2,
                  },
                  '&::-webkit-scrollbar-track': {
                    width: 2,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'gray',
                    borderRadius: '24px',
                  },
                }}
              >
                {isOpen &&
                  notificationData.map((item: TNotification, index) => {
                    const isLastItem = index === notificationData.length - 1;
                    const isAddMoney = item.type === TYPE.ADD_MONEY;

                    return (
                      <Box key={item._id} data-testid="notification-item">
                        <NotificationItem
                          notification={item}
                          isAddMoney={isAddMoney}
                          isLastItem={isLastItem}
                          onToggleModal={handleToggleModal}
                          onUpdateNotification={handleUpdateNotification}
                        />
                      </Box>
                    );
                  })}
              </Flex>
            </MenuList>
          </Box>
        )}
      </Menu>
      {isOpenConfirmModal && (
        <Modal
          title="Delete Notification"
          isOpen={isOpenConfirmModal}
          haveCloseButton
          body={
            <ModalContentMemorized
              isDeleteNotification={isDeleteNotification}
              onDelete={handleDeleteData}
              onCancel={handleToggleModal}
            />
          }
          onClose={handleToggleModal}
        />
      )}
    </Indicator>
  );
};

const NotificationMemorized = memo(Notification, isEqual);
export default NotificationMemorized;
