import React from 'react';
import styles from './Comment.module.scss';
import { TComment } from '../../features/comments/Comments.types';
import Circle from 'src/components/Circle/Circle';
import SvgSelector from 'src/components/SvgSelector/SvgSelector';
import CheckBox from '../CheckBox/CheckBox';
import { useBubbles } from '../../hooks/useBubble';
import clsx from 'clsx';

interface TCommentProps extends TComment {
  handleLike: () => void;
  handleDislike: () => void;
}

const Comment: React.FC<TCommentProps> = ({
  id,
  name,
  lastName,
  data,
  isLike,
  like,
  isDislike,
  dislike,
  handleLike,
  handleDislike,
}) => {
  const { bubblesElement, startAnimation } = useBubbles();

  return (
    <li className={styles.comment}>
      <Circle />
      <div className={styles.content}>
        <div className={styles.author}>
          <div className={styles.name}>{name}</div>
          <div className={styles.lastName}>{lastName}</div>
          <div className={styles.time}>25 минут назад</div>
        </div>
        {data}
        <div className={styles.activity}>
          <CheckBox
            checked={isLike}
            onCheckboxClick={handleLike}
            icon={<SvgSelector id={'likeOff'} className={styles.svg} />}
            checkedIcon={<SvgSelector id={'likeOn'} className={styles.svg} />}
          />
          <div className={styles.like}>{like}</div>
          <CheckBox
            checked={isDislike}
            onCheckboxClick={handleDislike}
            icon={<SvgSelector id={'dislikeOff'} className={styles.svg} />}
            checkedIcon={
              <SvgSelector id={'dislikeOn'} className={styles.svg} />
            }
          />
          <div className={styles.dislike}> {dislike}</div>
        </div>
      </div>
      <div className={clsx('wrapper', styles.wrapper)}>
        <button onClick={startAnimation}>
          <SvgSelector id={'more'} className={styles.info} />
        </button>
        {bubblesElement}
      </div>
    </li>
  );
};

export default Comment;
