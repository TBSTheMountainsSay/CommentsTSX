import React, { useState } from 'react';
import styles from './CheckBox.module.scss';
import SvgSelector from '../SvgSelector/SvgSelector';
import clsx from 'clsx';
import { TComment } from '../../features/comments/Comments.types';

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
  const [bubbles, setBubbles] = useState<number[]>([]);

  return (
    <div className={styles.wrapper}>
      <button
        className={clsx(className, styles.checkbox)}
        onClick={() => {
          onCheckboxClick();
          setBubbles([...bubbles, 1]);
          setTimeout(() => {
            const bubbleCopy = [...bubbles];
            bubbleCopy.unshift();
            setBubbles(bubbleCopy);
          }, 500);
        }}
      >
        {checked
          ? checkedIcon || <SvgSelector id={'checkboxChecked'} />
          : icon || <SvgSelector id={'checkboxUnchecked'} />}
      </button>
      <div className={styles.bubbles}>
        {bubbles.map((bubble) => (
          <div />
        ))}
      </div>
    </div>
  );
};

export default CheckBox;
