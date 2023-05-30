import React, { useState } from 'react';
import styles from './CheckBox.module.scss';
import SvgSelector from '../SvgSelector/SvgSelector';
import clsx from 'clsx';
import { useBubbles } from '../../hooks/useBubble';

type TCheckBoxProps = {
  checked: boolean;
  onCheckboxClick: () => void;
  icon: JSX.Element;
  checkedIcon: JSX.Element;
  className?: string;
};

const CheckBox: React.FC<TCheckBoxProps> = ({
  checked,
  onCheckboxClick,
  icon,
  checkedIcon,
  className,
}) => {
  const { bubblesElement, startAnimation } = useBubbles();

  return (
    <div className="wrapper">
      <button
        className={clsx(className, styles.checkbox)}
        onClick={() => {
          onCheckboxClick();
          startAnimation();
        }}
      >
        {checked
          ? checkedIcon || <SvgSelector id={'checkboxChecked'} />
          : icon || <SvgSelector id={'checkboxUnchecked'} />}
      </button>
      {bubblesElement}
    </div>
  );
};

export default CheckBox;
