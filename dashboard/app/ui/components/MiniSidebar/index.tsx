// Libs
import { memo } from 'react';
import {
  Box,
  Center,
  ColorMode,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Image,
  VStack,
  useColorMode,
} from '@chakra-ui/react';

// components
import { Menu } from '@/ui/components';

// constants
import { IMAGES, SIDEBAR, MINI_SIDEBAR_MENU } from '@/lib/constants';

// Types
import { TImage } from '@/lib/interfaces';
import { TMenuItem } from '@/ui/components/common/Menu';
import { TSidebarProps } from '@/ui/layouts/Sidebar';

const MiniSidebar = ({
  role,
  isExpandSidebar,
  onClose,
  onOpen,
  onSignOut,
}: TSidebarProps) => {
  const { colorMode } = useColorMode();

  const logos: Record<ColorMode, TImage> = {
    light: IMAGES.LOGO_MINI_LIGHT,
    dark: IMAGES.LOGO_MINI_DARK,
  };

  return (
    <Drawer
      placement="left"
      onClose={onClose}
      isOpen={isExpandSidebar as boolean}
      closeOnOverlayClick={false}
      trapFocus={false}
      variant="clickThrough"
      blockScrollOnMount={false}
    >
      <DrawerContent
        maxW={SIDEBAR.MINI_SIDEBAR_WIDTH}
        maxH="full"
        display={{
          base: 'none',
          md: 'block',
        }}
        bg="background.component.primary"
      >
        <DrawerHeader
          as={Center}
          h={108}
          borderRightColor="border.secondary"
          borderRightWidth="1px"
          borderBottomColor="border.secondary"
          borderBottomWidth="1px"
        >
          {/* Mini Logo in Light Mode */}
          <Image
            src={logos[colorMode]?.url}
            alt={logos[colorMode]?.alt}
            w={8}
            h={45}
            cursor="pointer"
          />

          {/* Close Button of Mini Sidebar */}
          <Image
            src={IMAGES.LEFT_ARROW.url}
            alt={IMAGES.LEFT_ARROW.alt}
            position="absolute"
            top="auto"
            transform="rotate(180deg)"
            right={-4}
            onClick={onOpen}
            display={{
              base: 'none',
              lg: 'block',
            }}
            cursor="pointer"
          />
        </DrawerHeader>

        <DrawerBody
          w="full"
          pt={3.5}
          pb={50}
          h="full"
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '&::-webkit-scrollbar-thumb': {
              display: 'none',
            },
          }}
          display="flex"
          justifyContent="center"
        >
          <VStack>
            <Box
              sx={{
                textAlign: '-webkit-center',
              }}
            >
              {MINI_SIDEBAR_MENU(role as string).map((item) => (
                <Menu
                  key={item.id}
                  title={item.title}
                  listItem={item.listItem as TMenuItem[]}
                  isExpandSidebar
                  onSignOut={onSignOut}
                />
              ))}
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const MiniSidebarMemorized = memo(MiniSidebar);
export default MiniSidebarMemorized;
