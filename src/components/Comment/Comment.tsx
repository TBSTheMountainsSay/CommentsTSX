import React from 'react';
import styles from './Comment.module.scss';
import { TComment } from '../../features/comments/Comments.types';
import Circle from 'src/components/Circle/Circle';
import SvgSelector from 'src/components/SvgSelector/SvgSelector';

interface TCommentProps extends TComment {}

const Comment: React.FC<TCommentProps> = ({
  id,
  name,
  lastName,
  data,
  like,
  dislike,
}) => {
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
          <div className={styles.like}>{like}</div>
          <div className={styles.dislike}> {dislike}</div>
        </div>
      </div>
    </li>
  );
};

export default Comment;
