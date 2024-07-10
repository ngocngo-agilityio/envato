// Libs
import { memo, useCallback } from 'react';
import { Box, CloseButton, Image } from '@chakra-ui/react';

// Constants
import { IMAGES } from '@/lib/constants';

interface Props {
  previewURL: string;
  index: number;
  onRemove: (index: number) => void;
}

const ProductGallery = ({ previewURL, index, onRemove }: Props) => {
  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <Box position="relative">
      <CloseButton
        color="common.white"
        bg="primary.600"
        borderRadius="50%"
        fontSize={8}
        size="lg"
        w={5}
        h={5}
        onClick={handleRemove}
        data-testid="del-icon"
        position="absolute"
        right={0}
      />
      <Image
        w={{ base: 250, default: 320, md: 150 }}
        h={{ base: 250, default: 320, md: 150 }}
        src={previewURL || IMAGES.SIGN_UP.url}
        alt={IMAGES.AVATAR_SIGN_UP.alt}
        fallbackSrc={IMAGES.SIGN_UP.url}
        borderRadius={20}
        objectFit="contain"
      />
    </Box>
  );
};

export default memo(ProductGallery);
