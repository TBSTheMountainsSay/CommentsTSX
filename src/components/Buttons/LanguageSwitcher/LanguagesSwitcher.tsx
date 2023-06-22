import React from 'react';
import styles from './LanguagesSwitcher.module.scss';
import clsx from 'clsx';
import { TLanguage } from '../../../App';
import { useBubbles } from '../../../hooks/useBubble';

type TLanguagesSwitcherProps = {
  language: TLanguage;
  handleChangeLanguage: () => void;
};

const LanguagesSwitcher: React.FC<TLanguagesSwitcherProps> = ({
  handleChangeLanguage,
  language,
}) => {
  const { bubblesElement, startAnimation } = useBubbles();

  return (
    <div className={clsx('wrapper', styles.languages_switch_wrapper)}>
      <button
        onClick={() => {
          handleChangeLanguage();
          startAnimation();
        }}
      >
        {language}
      </button>
      {bubblesElement}
    </div>
  );
};

export default LanguagesSwitcher;
