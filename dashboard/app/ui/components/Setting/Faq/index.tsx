import { memo } from 'react';

// Constants
import { FAQ_DATA } from '@/lib/constants';

// Components
import { FaqItem } from '@/ui/components';

const FaqPage = () =>
  FAQ_DATA.map(({ id, question, answer }) => (
    <FaqItem key={id} question={question} answer={answer} />
  ));

const FaqPageMemorized = memo(FaqPage);

export default FaqPageMemorized;
