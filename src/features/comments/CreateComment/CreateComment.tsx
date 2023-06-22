import styles from './CreateComment.module.scss';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import Circle from '../../../components/Circle/Circle';
import { FormattedMessage, injectIntl } from 'react-intl';

type TCreateCommentProps = {
  handleIsActive: () => void;
  isActive: boolean;
  handleChangeComment: (е: React.ChangeEvent<HTMLTextAreaElement>) => void;
  comment: string;
  handleCancel: () => void;
  handleAddComment: () => void;
  intl: any;
};

const CreateComment: React.FC<TCreateCommentProps> = ({
  handleIsActive,
  isActive,
  handleChangeComment,
  comment,
  handleCancel,
  handleAddComment,
  intl,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = '1.5rem';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [comment]);

  return (
    <div className={styles.createComment}>
      <Circle />
      <div className={styles.content}>
        <div className={styles.textarea} onClick={handleIsActive}>
          <textarea
            placeholder={intl.formatMessage({ id: 'placeholder_comment' })}
            onChange={handleChangeComment}
            value={comment}
            ref={textareaRef}
          />
        </div>

        <div className={clsx(styles.hidden, { [styles.buttons]: isActive })}>
          <button className={styles.cancel} onClick={handleCancel}>
            <FormattedMessage id="cancel" />
          </button>

          <button
            disabled={comment === ''}
            className={clsx({
              [styles.disabled]: comment === '',
              [styles.add]: comment !== '',
            })}
            onClick={handleAddComment}
          >
            <FormattedMessage id="add_comment" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(CreateComment);
