'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Flex,
  useDisclosure,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Component
import { Header, SideBar } from '@/ui/layouts';
import { Indicator } from '@/ui/components';

// Constants
import { END_POINTS, SHOW_TIME, SIDEBAR } from '@/lib/constants';

// Hooks
import { useAuth } from '@/lib/hooks';

// Stores
import { TAuthStoreData, authStore } from '@/lib/stores';

// Utils
import { isWindowDefined } from '@/lib/utils';

// Provider
// import { CheckPinCodeProvider } from '@/ui/providers';

// firebase
import { getMessaging, onMessage } from 'firebase/messaging';

// Interfaces
import { TUserDetail } from '@/lib/interfaces';

// Lazy loading components
const CheckPinCodeProvider = dynamic(
  () => import('@/ui/providers/CheckPinCode'),
);

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop] = useMediaQuery('(min-width: breakpoints.4xl)');
  const {
    isOpen: isExpandSidebar,
    onOpen,
    onClose,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const user = authStore((state): TAuthStoreData['user'] => state.user);
  const { isLogoutHandling, signOut } = useAuth();

  useEffect(() => {
    if (isDesktop) {
      onOpen();
    }
  }, [isDesktop, onOpen]);

  const toast = useToast();

  const queryClient = useQueryClient();

  const messaging = isWindowDefined() ? getMessaging() : null;

  messaging &&
    onMessage(messaging, async (payload) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [END_POINTS.MY_WALLET],
        }),
        queryClient.invalidateQueries({
          queryKey: [END_POINTS.TRANSACTIONS],
        }),
        queryClient.invalidateQueries({
          queryKey: [END_POINTS.NOTIFICATION],
        }),
      ]).finally(() => {
        toast({
          title: payload?.notification?.title,
          description: payload?.notification?.body,
          status: 'success',
          duration: SHOW_TIME,
          isClosable: true,
          position: 'top-right',
        });
      });
    });

  return (
    <>
      <Indicator isOpen={isLogoutHandling}>
        <Flex w="full" h="full" bg="background.body.primary">
          <Box
            pl={{
              base: 0,
              md: SIDEBAR.MINI_SIDEBAR_WIDTH,
              lg: SIDEBAR.MINI_SIDEBAR_WIDTH,
              '4xl': isExpandSidebar
                ? SIDEBAR.EXPAND_SIDEBAR_WIDTH
                : SIDEBAR.MINI_SIDEBAR_WIDTH,
            }}
            w="full"
            minH="100vh"
            h="full"
            sx={{
              transition: 'all .25s ease-in-out',
            }}
          >
            <SideBar
              isExpandSidebar={isExpandSidebar}
              user={user as TUserDetail}
              onOpen={onOpen}
              onClose={onClose}
              onSignOut={signOut}
            />
            <Header />
            {children}
          </Box>
        </Flex>
      </Indicator>
      {!user?.pinCode && <CheckPinCodeProvider />}
    </>
  );
};

export default MainLayout;
