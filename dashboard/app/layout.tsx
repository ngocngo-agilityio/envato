import type { Metadata, Viewport } from 'next';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import './globals.css';

// Providers
import {
  ChakraProvider,
  CheckAuthenticationProvider,
  QueryProvider,
} from '@/ui/providers';

// Fonts
import { fontFamilies } from '@/ui/themes/bases';
import MetadataMemorize from './metadata';

// Utils
import { getTheme } from '@/lib/utils/updateColorScheme';

// Themes
import { colors } from '@/ui/themes/bases';

// Constants
import { THEMES } from '@/lib/constants';

// Styles
import '@/ui/styles/index.css';

export const metadata: Metadata = {
  title: 'Envato Market - Manage users and transactions on every purchase',
  description:
    'Envato Market will receive all transactions from furniture purchase and show users in the system.',
  icons: {
    icon: '/icons/logo-mini-light.svg',
  },
};

let colorMode: RequestCookie | undefined;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  colorMode = cookieStore
    .getAll()
    .find((cookie) => cookie.name === 'colormode');

  return (
    <html
      lang="en"
      className={`${fontFamilies.urbanist.variable} ${fontFamilies.poppins.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: getTheme }}></script>
        <MetadataMemorize />
      </head>

      <body>
        <QueryProvider>
          <ChakraProvider>
            <CheckAuthenticationProvider>
              {children}
            </CheckAuthenticationProvider>
          </ChakraProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor:
    colorMode && colorMode.value === THEMES.DARK
      ? colors['background']['body']['primary']['_dark']
      : colors['primary']['200'],
};
