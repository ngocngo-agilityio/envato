'use client';

import { MouseEvent, ReactNode, memo } from 'react';
import { Link } from '@chakra-ui/next-js';
import { usePathname } from 'next/navigation';
import isEqual from 'react-fast-compare';

export type TNavigationProps = {
  children: ReactNode;
  destination?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

const Navigation = ({
  children,
  destination = '/',
  onClick,
}: TNavigationProps) => {
  const pathname = usePathname();

  const isActive: boolean = `/${pathname?.slice(1)}` === destination;

  return (
    <Link
      href={destination}
      onClick={onClick}
      aria-label="navigate-item"
      variant={isActive ? 'primary' : 'default'}
    >
      {children}
    </Link>
  );
};

const NavigationMemorized = memo(Navigation, isEqual);

export default NavigationMemorized;
