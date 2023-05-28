import styles from './Create-comment.module.scss';
import clsx from 'clsx';
import React from 'react';

type TCreateCommentProps = {
  handleIsActive: () => void;
  isActive: boolean;
  handleChangeComment: (е: React.ChangeEvent<HTMLTextAreaElement>) => void;
  comment: string;
  handleCancel: () => void;
};

const CreateComment: React.FC<TCreateCommentProps> = ({
  handleIsActive,
  isActive,
  handleChangeComment,
  comment,
  handleCancel,
}) => {
  return (
    <div className={styles.createComment}>
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
        <button
          className={clsx({
            [styles.disabled]: comment == '',
            [styles.add]: comment !== '',
          })}
        >
          Оставить комментарий
        </button>
      </div>
    </div>
  );
};

export default CreateComment;
