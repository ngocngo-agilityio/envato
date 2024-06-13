import dynamic from 'next/dynamic';
import Head from 'next/head';

// Components
const MainLayout = dynamic(() => import('@/ui/layouts/MainLayout'));

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Head>
      <link rel="preconnect" href="https://succinct-shrouded-acorn.glitch.me" />
      <link
        rel="dns-prefetch"
        href="https://succinct-shrouded-acorn.glitch.me"
      />
    </Head>
    <MainLayout>{children}</MainLayout>
  </>
);

export default Layout;
