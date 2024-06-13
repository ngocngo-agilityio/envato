'use client';

// Libs
import { memo } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';

// Components
import { CardIssues, Loading } from '@/ui/components';

// Interfaces
import { IIssues } from '@/lib/interfaces';

interface CustomerProps {
  dataList?: IIssues[];
  isFetching?: boolean;
  isDisabled?: boolean;
  hasNextPage?: boolean;
  onLoadMore: () => void;
}

const CustomerIssues = ({
  dataList = [],
  isFetching = false,
  isDisabled = false,
  hasNextPage = true,
  onLoadMore,
}: CustomerProps) => (
  <Box
    px={8}
    py={6}
    borderWidth="1px"
    rounded={8}
    h="fit-content"
    minW={{ xl: 400, '5xl': 450 }}
    borderColor="border.septenary"
  >
    <Text fontSize="lg" color="text.primary" fontWeight="bold" mb={4}>
      Recent Support
    </Text>

    {dataList && (
      <Box
        maxH={1045}
        overflowY="scroll"
        css={{
          '&::-webkit-scrollbar': {
            width: 2,
          },
          '&::-webkit-scrollbar-track': {
            width: 2,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray',
            borderRadius: '24px',
          },
        }}
      >
        {dataList?.map((item) => {
          const {
            _id = '',
            firstName = '',
            lastName = '',
            title = '',
            description = '',
            avatar = '',
            createdAt = '',
          } = item || {};

          return (
            <Flex key={_id}>
              <CardIssues
                firstName={firstName}
                lastName={lastName}
                title={title}
                description={description}
                avatar={avatar}
                createdAt={createdAt}
              />
            </Flex>
          );
        })}
      </Box>
    )}

    {isFetching && <Loading />}

    {hasNextPage && (
      <Button
        aria-label="btn load-more"
        bg="text.primary"
        border="1px"
        color="text.textLoadMore"
        mt={4}
        _hover={{
          bg: 'text.textLoadMore',
          border: '1px',
          borderColor: 'border.octonary',
          color: 'text.primary',
        }}
        isDisabled={isDisabled}
        onClick={onLoadMore}
      >
        Load More
      </Button>
    )}
  </Box>
);

const CustomerIssuesMemorize = memo(CustomerIssues, isEqual);
export default CustomerIssuesMemorize;
