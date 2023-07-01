import React from 'react';
import styles from './Comment.module.scss';
import { TComment } from '../../features/comments/Comments.types';
import Circle from 'src/components/Circle/Circle';
import SvgSelector from 'src/components/SvgSelector/SvgSelector';
import CheckBox from '../CheckBox/CheckBox';
import { useBubbles } from '../../hooks/useBubble';
import clsx from 'clsx';
import ModalMenu from '../ModalMenu/ModalMenu';
import useClickAway from '../../hooks/useClickAway';
import { FormattedMessage, injectIntl } from 'react-intl';
import { timeFrom } from '../../helpers/helpers';

interface TCommentProps extends TComment {
  handleLike: () => void;
  handleDislike: () => void;
  handleMenuButton: () => void;
  isActiveMenu: boolean;
  handleDeleteComment: () => void;
  handleEditComment: () => void;
  userId: number;
  intl: any;
}

const Comment: React.FC<TCommentProps> = ({
  id,
  name,
  lastName,
  data,
  likes,
  dislikes,
  date,
  edited,
  handleLike,
  handleDislike,
  handleMenuButton,
  isActiveMenu,
  handleDeleteComment,
  handleEditComment,
  userId,
  intl,
}) => {
  const { bubblesElement, startAnimation } = useBubbles();
  const refElement = useClickAway(() => {
    if (!isActiveMenu) return;
    handleMenuButton();
  });

  return (
    <li className={styles.comment}>
      <Circle />
      <div className={styles.content}>
        <div className={styles.author}>
          <div className={styles.name}>{name}</div>
          <div className={styles.lastName}>{lastName}</div>
          <div className={styles.time}>
            {timeFrom(date)}{' '}
            {edited && `(${intl.formatMessage({ id: 'edited' })})`}
          </div>
        </div>
        {data}
        <div className={styles.activity}>
          <CheckBox
            checked={likes.includes(userId)}
            onCheckboxClick={handleLike}
            icon={<SvgSelector id={'likeOff'} className={styles.svg} />}
            checkedIcon={<SvgSelector id={'likeOn'} className={styles.svg} />}
          />
          <div className={styles.like}>{likes.length}</div>
          <CheckBox
            checked={dislikes.includes(userId)}
            onCheckboxClick={handleDislike}
            icon={<SvgSelector id={'dislikeOff'} className={styles.svg} />}
            checkedIcon={
              <SvgSelector id={'dislikeOn'} className={styles.svg} />
            }
          />
          <div className={styles.dislike}> {dislikes.length}</div>
        </div>
      </div>
      <div
        className={clsx('wrapper', styles.wrapper)}
        onClick={handleMenuButton}
        ref={refElement}
      >
        <button onClick={startAnimation}>
          <SvgSelector id={'more'} className={styles.info} />
        </button>
        <div
          className={clsx({
            [styles.visible]: isActiveMenu,
            [styles.invisible]: !isActiveMenu,
          })}
        >
          <ModalMenu
            handleDeleteComment={handleDeleteComment}
            handleEditComment={handleEditComment}
          />
        </div>
        {bubblesElement}
      </div>
    </li>
  );
};

export default injectIntl(Comment);
