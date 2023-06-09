import React from 'react';
import styles from './LanguagesSwitcher.module.scss';
import clsx from 'clsx';
import { useBubbles } from '../../../hooks/useBubble';
import { TLanguage } from '../../../app.slice';

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
