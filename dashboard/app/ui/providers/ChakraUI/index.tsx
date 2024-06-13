'use client';

import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

// Themes
import { configThemes } from '@/ui/themes';

type TChakraProvider = {
  children: ReactNode;
};

const ThemesProvider = ({ children }: TChakraProvider): JSX.Element => (
  <ChakraProvider theme={configThemes}>
    <>{children}</>
  </ChakraProvider>
);

export default ThemesProvider;
