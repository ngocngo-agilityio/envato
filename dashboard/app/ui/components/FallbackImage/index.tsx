// Libs
import { memo } from 'react';
import { Image, ImageProps } from '@chakra-ui/react';

// Constants
import { IMAGES } from '@/lib/constants';

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
  fallbackStrategy?: 'onError';
}

const FallbackImage = ({
  fallbackSrc = IMAGES.FALLBACK.url,
  fallbackStrategy = 'onError',
  ...props
}: FallbackImageProps) => (
  <Image
    {...props}
    fallbackStrategy={fallbackStrategy}
    fallbackSrc={fallbackSrc}
  />
);

const FallbackImageMemorized = memo(FallbackImage);

export default FallbackImageMemorized;
