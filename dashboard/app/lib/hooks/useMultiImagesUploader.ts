// Libs
import { useMutation } from '@tanstack/react-query';

// Types
import { IUploadImageResponse } from '@/lib/interfaces';

// Constants
import { SEARCH_PARAM } from '@/lib/constants';

// Services
import { uploadImageHttpService } from '@/lib/services';

export const useUploadImages = () => {
  const { mutate: uploadImages, ...rest } = useMutation({
    mutationFn: async (payloads: FormData[]) => await Promise.all(payloads.map(item => uploadImageHttpService.post<IUploadImageResponse>({
      path: '',
      data: item,
      configs: {
        params: { key: SEARCH_PARAM.UPLOAD_IMAGE },
      },
    })))
  });

  return { ...rest, uploadImages };
};
