'use client';

import { ReactElement, useMemo, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Components
import { Indicator, ItemSideBarSetting } from '@/ui/components';

// Constants
import { OPTION_SETTING } from '@/lib/constants';

// Lazy loading components
const AvatarSetting = dynamic(() =>
  import('@/ui/components/Icons/AvatarSetting').then((module) => ({
    default: module.AvatarSetting,
  })),
);
const Faq = dynamic(() =>
  import('@/ui/components/Icons/Faq').then((module) => ({
    default: module.Faq,
  })),
);
const Security = dynamic(() =>
  import('@/ui/components/Icons/Security').then((module) => ({
    default: module.Security,
  })),
);
const TermCondition = dynamic(() =>
  import('@/ui/components/Icons/TermCondition').then((module) => ({
    default: module.TermCondition,
  })),
);
const TermAndCondition = dynamic(
  () => import('@/ui/components/Setting/TermAndCondition'),
  {
    loading: () => <Indicator isOpen={true} />,
  },
);
const UserForm = dynamic(() => import('@/ui/components/Setting/Personal'), {
  loading: () => <Indicator isOpen={true} />,
});
const FaqPage = dynamic(() => import('@/ui/components/Setting/Faq'), {
  loading: () => <Indicator isOpen={true} />,
});
const SecurityPage = dynamic(() => import('@/ui/components/Setting/Security'), {
  loading: () => <Indicator isOpen={true} />,
});

const Settings = () => {
  const [activeItemId, setActiveItemId] = useState<string>(
    OPTION_SETTING.USER_FORM,
  );

  const pages: Record<string, ReactElement> = {
    [OPTION_SETTING.USER_FORM]: <UserForm />,
    [OPTION_SETTING.FAQ_PAGE]: <FaqPage />,
    [OPTION_SETTING.SECURITY_PAGE]: <SecurityPage />,
    [OPTION_SETTING.TERM_AND_CONDITION]: <TermAndCondition />,
  };

  const renderSettingOptions = useMemo(() => {
    const ITEMS = [
      {
        id: OPTION_SETTING.USER_FORM,
        title: 'Personal Informations',
        content: 'Fill in your personal information',
        icon: <AvatarSetting />,
      },
      {
        id: OPTION_SETTING.FAQ_PAGE,
        title: 'FAQ',
        content: 'Frequently asked questions',
        icon: <Faq />,
      },
      {
        id: OPTION_SETTING.SECURITY_PAGE,
        title: 'Security',
        content: 'Change your password',
        icon: <Security />,
      },
      {
        id: OPTION_SETTING.TERM_AND_CONDITION,
        title: 'Term and Conditions',
        content: 'Term and Conditions of use and privacy policy',
        icon: <TermCondition />,
      },
    ];

    return ITEMS.map(({ id, icon, title, content }) => (
      <ItemSideBarSetting
        key={id}
        id={id}
        activeItemId={activeItemId}
        onClick={setActiveItemId}
        title={title}
        content={content}
      >
        {icon}
      </ItemSideBarSetting>
    ));
  }, [activeItemId]);

  return (
    <Grid
      bg="background.body.primary"
      borderRadius="lg"
      gridTemplateColumns={{
        base: 'repeat(1,minmax(0,1fr))',
        xl: 'repeat(12,minmax(0,1fr))',
      }}
      px={{ base: 6, md: 12 }}
      py={12}
    >
      <GridItem px={4} py={6} colSpan={3} bg="background.body.quaternary">
        {renderSettingOptions}
      </GridItem>

      <GridItem colSpan={9} px={10} py={8} bg="background.body.quaternary">
        {pages[activeItemId]}
      </GridItem>
    </Grid>
  );
};

export default Settings;
