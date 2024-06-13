// Libs
import { memo, useCallback } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Image,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';

// components
import { Logo, Menu } from '@/ui/components';
import { TMenuItem } from '@/ui/components/common/Menu';

// constants
import { SIDEBAR, IMAGES, EXPAND_SIDEBAR_MENU_LIST } from '@/lib/constants';

// Interfaces
import { TSidebarProps } from '@/ui/layouts/Sidebar';

const ExpandSidebar = ({
  role,
  isExpandSidebar,
  onClose,
  onSignOut,
}: TSidebarProps) => {
  const [isMobileAndTablet] = useMediaQuery('(max-width: breakpoints.4xl)');

  const handleCloseSideBar = useCallback(() => {
    isMobileAndTablet && onClose();
  }, [isMobileAndTablet, onClose]);

  return (
    <Drawer
      placement="left"
      onClose={onClose}
      isOpen={isExpandSidebar as boolean}
      trapFocus={false}
      onOverlayClick={handleCloseSideBar}
      variant={{
        '4xl': 'clickThrough',
      }}
      blockScrollOnMount={false}
    >
      <DrawerOverlay data-testid="expand-overlay" />

      <DrawerContent
        maxW={SIDEBAR.EXPAND_SIDEBAR_WIDTH}
        display="block"
        bg="background.component.primary"
        maxH="full"
      >
        <DrawerHeader
          display="flex"
          alignItems="center"
          h={108}
          borderRightColor="border.secondary"
          borderRightWidth="1px"
          borderBottomColor="border.secondary"
          borderBottomWidth="1px"
          pl={12.5}
        >
          <Logo />

          {/* Close button of Expand sidebar */}
          <Image
            src={IMAGES.LEFT_ARROW.url}
            alt={IMAGES.LEFT_ARROW.alt}
            position="absolute"
            top="auto"
            right={0}
            onClick={onClose}
            cursor="pointer"
            id="close-expand"
          />
        </DrawerHeader>

        <DrawerBody
          pt={3.5}
          pl={12}
          pb={50}
          pr={0}
          w="full"
          h="full"
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '&::-webkit-scrollbar-thumb': {
              display: 'none',
            },
          }}
        >
          <VStack pr={12.5} mb={9}>
            {EXPAND_SIDEBAR_MENU_LIST(role as string).map((item) => (
              <Menu
                key={item.title}
                title={item.title}
                listItem={item.listItem as TMenuItem[]}
                onClickMenuItem={handleCloseSideBar}
                onSignOut={onSignOut}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const ExpandSidebarMemorized = memo(ExpandSidebar);
export default ExpandSidebarMemorized;
