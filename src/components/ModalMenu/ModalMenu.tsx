import React from 'react';
import styles from './ModalMenu.module.scss';
import SvgSelector from '../SvgSelector/SvgSelector';

type TModalProps = {
  handleDeleteComment: () => void;
};

const ModalMenu: React.FC<TModalProps> = ({ handleDeleteComment }) => {
  return (
    <div className={styles.menu}>
      <button className={styles.button}>
        <SvgSelector id={'edit'} className={styles.svg} />
        Изменить
      </button>

      <button className={styles.button} onClick={handleDeleteComment}>
        <SvgSelector id={'delete'} className={styles.svg} />
        Удалить
      </button>
    </div>
  );
};

export default ModalMenu;
