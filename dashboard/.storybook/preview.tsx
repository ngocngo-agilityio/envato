import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import { useColorMode } from '@chakra-ui/react';
import '../app/globals.css';

//Providers
import { ChakraProvider, QueryProvider } from '../app/ui/providers';

// Themes
import { configThemes } from '../app/ui/themes';

// Styles
import '../app/ui/styles/index.css';

interface ColorModeProps {
  colorMode: 'light' | 'dark';
  children: JSX.Element;
}

function ColorMode(props: ColorModeProps) {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(props.colorMode);
  }, [props.colorMode]);

  return props.children;
}

const preview: Preview = {
  parameters: {
    chakra: {
      theme: configThemes,
    },
    nextjs: {
      appDirectory: true,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    decorators: [
      (Story, context) => (
        <QueryProvider>
          <ChakraProvider>
            <ColorMode colorMode={context.globals.colorMode}>
              <Story />
            </ColorMode>
          </ChakraProvider>
        </QueryProvider>
      ),
    ],
  },
};

export default preview;
