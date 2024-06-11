// Libs
import { useMutation } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';

// Types
import { IUploadImageResponse } from '@/lib/interfaces';

// Constants
import {
  ERROR_MESSAGES,
  LIMIT_PRODUCT_IMAGES,
  REGEX,
  SEARCH_PARAM,
  STATUS,
} from '@/lib/constants';

// Services
import { uploadImageHttpService } from '@/lib/services';
import { useCallback, useState } from 'react';
import { customToast } from '../utils';
import { useToast } from '@chakra-ui/react';

export const useUploadImage = () => {
  const { mutate: uploadImage, ...rest } = useMutation({
    mutationFn: async (payload: FormData) =>
      await uploadImageHttpService.post<IUploadImageResponse>({
        path: '',
        data: payload,
        configs: {
          params: { key: SEARCH_PARAM.UPLOAD_IMAGE },
        },
      }),
  });

  return { ...rest, uploadImage };
};

export const useUploadProductImageFiles = (imageURLs: string[] = []) => {
  const [previewURLs, setPreviewURL] = useState<string[]>(imageURLs || []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isImagesDirty, setIsImagesDirty] = useState(false);

  const toast = useToast();

  const handleShowErrorMessage = useCallback(
    (message: string) => {
      toast(customToast('', message, STATUS.ERROR));
    },
    [toast],
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      const updatedImages = [...previewURLs];
      updatedImages.splice(index, 1);

      setPreviewURL(updatedImages);
      setIsImagesDirty(true);
    },
    [previewURLs],
  );

  const handleFilesChange = useCallback(
    (files: File[]) => {
      console.log('files', files);

      const imagesPreview: React.SetStateAction<string[]> = [];

      if (files.length > LIMIT_PRODUCT_IMAGES) {
        return handleShowErrorMessage(ERROR_MESSAGES.UPLOAD_IMAGE_ITEM);
      }

      files.map(async (file) => {
        if (!file) {
          return;
        }

        // Check type of image
        if (!REGEX.IMG.test(file.name)) {
          return handleShowErrorMessage(ERROR_MESSAGES.UPLOAD_IMAGE);
        }

        const previewImage: string = URL.createObjectURL(file);
        imagesPreview.push(previewImage);
      });

      setImageFiles(files);
      setPreviewURL(imagesPreview);
      setIsImagesDirty(true);
    },
    [handleShowErrorMessage],
  );

  const onDrop = (acceptedFiles: File[]) => {
    console.log('acceptedFiles', acceptedFiles);

    handleFilesChange(acceptedFiles);
  };

  const { getRootProps, getInputProps, isFileDialogActive } = useDropzone({
    onDrop,
  });

  console.log('imageFiles hook', imageFiles);

  return {
    getRootProps,
    getInputProps,
    handleRemoveImage,
    isFileDialogActive,
    previewURLs,
    imageFiles,
    isImagesDirty,
  };
};
