import React from 'react';
import styles from './ThemeSwitcher.module.scss';
import clsx from 'clsx';
import SvgSelector from '../../SvgSelector/SvgSelector';
import { useBubbles } from '../../../hooks/useBubble';

type TThemeSwitcherProps = {
  handleChangeTheme: () => void;
  isDarkTheme: boolean;
};

const ThemeSwitcher: React.FC<TThemeSwitcherProps> = ({
  handleChangeTheme,
  isDarkTheme,
}) => {
  const { bubblesElement, startAnimation } = useBubbles();

  return (
    <div className={clsx('wrapper', styles.theme_switch_wrapper)}>
      <button
        onClick={() => {
          handleChangeTheme();
          startAnimation();
        }}
      >
        <SvgSelector
          id={isDarkTheme ? 'dark_mode' : 'light_mode'}
          className={styles.theme_switch}
        />
      </button>
      {bubblesElement}
    </div>
  );
};

export default ThemeSwitcher;
