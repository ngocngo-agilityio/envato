'use client';

// Libs
import { ChangeEvent, useCallback, useState, memo } from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  Box,
  Heading,
  Text,
  Image,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  FormLabel,
} from '@chakra-ui/react';
import isEqual from 'react-fast-compare';

// Constants
import {
  AUTH_SCHEMA,
  ERROR_MESSAGES,
  IMAGES,
  REGEX,
  MAX_SIZE,
} from '@/lib/constants';

// Interface
import { TUserDetail } from '@/lib/interfaces';

export type TUpdateProfileProps = {
  control: Control<TUserDetail>;
  onUploadError: (message: string) => void;
  onFileChange: (file: File) => void;
};

const UpdateProfile = ({
  control,
  onUploadError,
  onFileChange,
}: TUpdateProfileProps) => {
  const [previewURL, setPreviewURL] = useState<string>('');

  const handleChangeFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = (e.target.files && e.target.files[0]) as File;

      // Check file is empty or undefined
      if (!file) {
        return;
      }

      // Check type of image
      if (!REGEX.IMG.test(file.name)) {
        return onUploadError(ERROR_MESSAGES.UPLOAD_IMAGE);
      }

      // Check size of image
      if (file.size > MAX_SIZE) {
        return onUploadError(ERROR_MESSAGES.UPLOAD_IMAGE_SIZE);
      }

      const previewImage: string = URL.createObjectURL(file);

      setPreviewURL(previewImage);

      onFileChange(file);
    },
    [onFileChange, onUploadError],
  );

  return (
    <Box>
      <Heading
        as="h4"
        textTransform="capitalize"
        color="text.quinary"
        fontWeight="bold"
        fontSize="lg"
        mb={2}
      >
        update profile
      </Heading>

      <Text color="text.quinary" mb={4}>
        Profile at least Size{' '}
        <Text as="span" color="text.senary">
          300 x 300.{' '}
        </Text>
        Gift to work too.
      </Text>

      <Controller
        control={control}
        name="avatarURL"
        rules={AUTH_SCHEMA.AVATAR_URL}
        render={({ field: { value } }) => (
          <Center position="relative">
            <FormLabel
              htmlFor="file"
              cursor="pointer"
              m={0}
              _hover={{ transform: 'scale(1.1)' }}
            >
              <Image
                borderRadius="50%"
                w="huge"
                h="huge"
                src={previewURL || value || IMAGES.AVATAR_SIGN_UP.url}
                alt={IMAGES.AVATAR_SIGN_UP.alt}
                fallbackSrc={IMAGES.USER.url}
                objectFit="cover"
              />
            </FormLabel>

            <InputGroup boxSize={0}>
              <InputLeftElement>
                <FormLabel htmlFor="file">
                  <Image
                    src={IMAGES.EDIT.url}
                    alt={IMAGES.EDIT.alt}
                    objectFit="cover"
                    maxW={'none'}
                    position="absolute"
                    bottom={-31}
                    left="-48px"
                    zIndex={1}
                    border="none"
                    bg="none"
                    w="auto"
                    cursor="pointer"
                    _hover={{ transform: 'scale(1.1)' }}
                  />
                </FormLabel>
                <Input
                  value=""
                  borderRadius="50%"
                  type="file"
                  opacity={0}
                  position="relative"
                  width="full"
                  height="full"
                  id="file"
                  data-testid="upload-image"
                  onChange={handleChangeFile}
                  accept="image/*"
                  data-testId="upload-image"
                />
              </InputLeftElement>
            </InputGroup>
          </Center>
        )}
      />
    </Box>
  );
};

const UpdateProfileMemorized = memo(UpdateProfile, isEqual);

export default UpdateProfileMemorized;
