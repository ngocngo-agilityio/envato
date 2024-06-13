import { memo, useCallback } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, MenuItem, Text } from '@chakra-ui/react';

// Utils
import { convertDateToTime } from '@/lib/utils';

// Interfaces
import { TNotification } from '@/lib/interfaces';

interface NotificationProps {
  notification: TNotification;
  isLastItem?: boolean;
  isAddMoney?: boolean;
  onToggleModal: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    id: string,
  ) => void;
  onUpdateNotification: (item: TNotification) => void;
}

const NotificationItem = ({
  notification,
  isLastItem = false,
  isAddMoney = false,
  onToggleModal,
  onUpdateNotification,
}: NotificationProps) => {
  const handleUpdateData = useCallback(
    () => onUpdateNotification(notification),
    [notification, onUpdateNotification],
  );

  const handleClickDeleteIcon = useCallback(
    (event: React.MouseEvent<SVGElement, MouseEvent>) =>
      onToggleModal(event, notification._id),
    [notification._id, onToggleModal],
  );

  return (
    <MenuItem
      key={notification._id}
      py={0}
      bg={
        notification.isMarkAsRead
          ? 'transparent'
          : 'background.component.tertiary'
      }
      _hover={{
        bg: 'background.component.tertiary',
        color: 'text.currencyColor',
      }}
    >
      <Flex flexDirection="column" w="full">
        <Flex alignItems="center" justifyContent="space-between">
          <Box
            {...(!notification.isMarkAsRead
              ? { onClick: handleUpdateData }
              : { cursor: 'not-allowed' })}
          >
            <Text fontSize="sm" color="text.nonary" mt={2}>
              <Text as="span" fontWeight="bold" pr={1} fontSize="sm">
                {notification?.sender}
              </Text>
              {notification?.content}
              {!isAddMoney && (
                <Text as="span" fontWeight="bold" fontSize="sm">
                  &nbsp;{notification.receiver}
                </Text>
              )}
              &nbsp;totaling
              <Text
                as="span"
                color={isAddMoney ? 'text.currencyColor' : 'red.500'}
                px={1}
                fontSize="sm"
              >
                ${notification.amount}
              </Text>
            </Text>
            <Text fontSize="xs" color="text.textTime" mt={2} mb={3}>
              {convertDateToTime(notification.createdAt as string)}
            </Text>
          </Box>
          <DeleteIcon
            position="relative"
            zIndex={10}
            data-testid={`delete-icon-${notification._id}`}
            onClick={handleClickDeleteIcon}
          />
        </Flex>
        {!isLastItem && <Divider color="gray.300" />}
      </Flex>
    </MenuItem>
  );
};

const NotificationMemorize = memo(NotificationItem);

export default NotificationMemorize;
