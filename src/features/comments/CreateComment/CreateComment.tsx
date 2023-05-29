import styles from './CreateComment.module.scss';
import clsx from 'clsx';
import React from 'react';
import Circle from '../../../components/Circle/Circle';

type TCreateCommentProps = {
  handleIsActive: () => void;
  isActive: boolean;
  handleChangeComment: (е: React.ChangeEvent<HTMLTextAreaElement>) => void;
  comment: string;
  handleCancel: () => void;
  handleAddComment: () => void;
};

const CreateComment: React.FC<TCreateCommentProps> = ({
  handleIsActive,
  isActive,
  handleChangeComment,
  comment,
  handleCancel,
  handleAddComment,
}) => {
  return (
    <div className={styles.createComment}>
      <Circle />
      <div className={styles.content}>
        <div className={styles.textarea} onClick={handleIsActive}>
          <textarea
            placeholder={'Введите комментарий'}
            onChange={handleChangeComment}
            value={comment}
          />
        </div>

        <div className={clsx(styles.hidden, { [styles.buttons]: isActive })}>
          <button className={styles.cancel} onClick={handleCancel}>
            Отмена
          </button>
          {comment === '' ? (
            <button disabled className={styles.disabled}>
              Оставить комментарий
            </button>
          ) : (
            <button className={styles.add} onClick={handleAddComment}>
              Оставить комментарий
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
