// Libs
import React, { memo } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Text,
  Input,
  ResponsiveValue,
  FormLabel,
  Flex,
} from '@chakra-ui/react';
import isEqual from 'react-fast-compare';

// Components
import { Loading, ProductGallery } from '@/ui/components';

export type TUploadImageImagesProps = {
  label: string;
  previewURLs?: string[];
  onChange: (files: File[]) => void;
  onRemove: (index: number) => void;
};

const UploadImages = ({
  label = 'Upload images',
  previewURLs = [],
  onChange,
  onRemove,
}: TUploadImageImagesProps) => {
  const onDrop = (acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  };

  const { getRootProps, getInputProps, isFileDialogActive } = useDropzone({
    onDrop,
  });

  return (
    <Flex w="100%" flexDirection="column">
      <FormLabel
        htmlFor="file"
        color="text.secondary"
        marginInlineEnd={0}
        minW="max-content"
      >
        {label}
        <Flex mt="20px" flexDirection="column" alignItems="center" gap={3}>
          {isFileDialogActive && <Loading />}
          <Flex
            alignItems="center"
            justify="center"
            gap={3}
            w={{ base: 320, md: 474 }}
            flexWrap="wrap"
          >
            {previewURLs
              .slice(0, 3)
              ?.map((previewURL, i) => (
                <ProductGallery
                  key={previewURL}
                  previewURL={previewURL}
                  index={i}
                  onRemove={onRemove}
                />
              ))}
          </Flex>
          <Flex alignItems="center" gap={3}>
            {previewURLs
              .slice(3, 5)
              ?.map((previewURL, i) => (
                <ProductGallery
                  key={previewURL}
                  previewURL={previewURL}
                  index={i + 3}
                  onRemove={onRemove}
                />
              ))}
          </Flex>
        </Flex>
      </FormLabel>
      <Box
        {...getRootProps()}
        border="1px"
        borderColor="primary.600"
        borderRadius="md"
        p={4}
        textAlign="center"
        cursor="pointer"
        _hover={{ borderColor: 'green.500' }}
        bg="background.body.primary"
      >
        <Input
          {...getInputProps()}
          size={undefined as ResponsiveValue<string> | undefined}
          data-testid="field-image"
        />

        <Text>Drag drop some files here, or click to select files</Text>
      </Box>
    </Flex>
  );
};

const UploadImagesMemorized = memo(UploadImages, isEqual);

export default UploadImagesMemorized;
