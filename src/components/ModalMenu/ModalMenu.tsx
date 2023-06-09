import React from 'react';
import styles from './ModalMenu.module.scss';
import SvgSelector from '../SvgSelector/SvgSelector';
import { FormattedMessage } from 'react-intl';

type TModalProps = {
  handleDeleteComment: () => void;
  handleEditComment: () => void;
};

const ModalMenu: React.FC<TModalProps> = ({
  handleDeleteComment,
  handleEditComment,
}) => {
  return (
    <div className={styles.menu}>
      <button className={styles.button} onClick={handleEditComment}>
        <SvgSelector id={'edit'} className={styles.svg} />
        <FormattedMessage id="edit" />
      </button>

      <button className={styles.button} onClick={handleDeleteComment}>
        <SvgSelector id={'delete'} className={styles.svg} />
        <FormattedMessage id="delete_comment" />
      </button>
    </div>
  );
};

export default ModalMenu;
