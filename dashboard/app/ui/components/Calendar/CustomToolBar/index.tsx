'use client';

// Libs
import { memo, useCallback, useMemo } from 'react';
import { Button, Flex, Heading, useMediaQuery } from '@chakra-ui/react';
import { Navigate, ToolbarProps, Views } from 'react-big-calendar';

// Components
import { Arrow } from '@/ui/components';

// Themes
import { useColorfill } from '@/ui/themes/bases';

const CustomToolbar = ({ label, view, onView, onNavigate }: ToolbarProps) => {
  const { primary } = useColorfill();
  const [isLargeThanMobile] = useMediaQuery('(min-width: 768px)');

  const handleViewDay = useCallback(() => onView(Views.DAY), [onView]);

  const handleViewWeek = useCallback(() => onView(Views.WEEK), [onView]);

  const handleViewMonth = useCallback(() => onView(Views.MONTH), [onView]);

  const handleBack = useCallback(
    () => onNavigate(Navigate.PREVIOUS),
    [onNavigate],
  );

  const handleNext = useCallback(() => onNavigate(Navigate.NEXT), [onNavigate]);

  const renderNextBackBtn = useMemo(
    () => (
      <Flex gap={{ base: 1, md: 0 }}>
        <Button
          aria-label="btn-back"
          variant="iconSecondary"
          w="30px"
          h="30px"
          onClick={handleBack}
        >
          <Arrow color={primary} width={30} height={30} rotate="90deg" />
        </Button>

        <Button
          aria-label="btn-next"
          variant="iconSecondary"
          w="30px"
          h="30px"
          onClick={handleNext}
        >
          <Arrow color={primary} width={30} height={30} rotate="-90deg" />
        </Button>
      </Flex>
    ),
    [handleBack, handleNext, primary],
  );

  return (
    <Flex justifyContent="space-between" alignItems="center" wrap="wrap" mb={6}>
      <Heading
        as="h3"
        variant="heading2Xl"
        fontWeight="bold"
        fontSize={{ base: '18px', '0.8sm': '20px', md: '24px' }}
      >
        Calendar
      </Heading>

      <Heading
        as="h3"
        variant="headingLg"
        fontSize={{ base: '16px', '0.8sm': '18px', md: '20px' }}
      >
        {label}
      </Heading>

      {!isLargeThanMobile && renderNextBackBtn}

      <Flex
        alignItems="center"
        wrap="wrap"
        justifyContent="flex-end"
        gap={2}
        w={{ base: '100%', md: 'auto' }}
        mt={{ base: 2, md: 0 }}
      >
        <Flex
          flex={1}
          flexDir={{ base: 'column', md: 'row' }}
          gap={{ base: 3, md: 1 }}
        >
          <Button
            size="sm"
            w={{ base: '100%', md: '60px' }}
            bg={view === Views.MONTH ? 'green.900' : 'primary.500'}
            onClick={handleViewMonth}
          >
            Month
          </Button>

          <Button
            size="sm"
            w={{ base: '100%', md: '60px' }}
            bg={view === Views.WEEK ? 'green.900' : 'primary.500'}
            onClick={handleViewWeek}
          >
            Week
          </Button>
          <Button
            size="sm"
            w={{ base: '100%', md: '60px' }}
            bg={view === Views.DAY ? 'green.900' : 'primary.500'}
            onClick={handleViewDay}
          >
            Day
          </Button>
        </Flex>
        {isLargeThanMobile && renderNextBackBtn}
      </Flex>
    </Flex>
  );
};

const CustomToolbarMemorized = memo(CustomToolbar);

export default CustomToolbarMemorized;
