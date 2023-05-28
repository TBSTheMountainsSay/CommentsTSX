import React, { useState } from 'react';
import styles from './Wrapper.module.scss';
import CreateComment from './Create-comment/Create-comment';
import Comment from './Comment/Comment';

type TWrapperProps = {};

const Wrapper: React.FC<TWrapperProps> = ({}) => {
  const emptyComment: string = '';
  // const initialState = {
  //   commentsData: [{ id: number; data: string; like: number; dislike: number } = { id: 0, data: 'Комментарий', like: 100, dislike: 10 }],
  // };
  const [isActive, setIsActive] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  const handleIsActive = () => {
    setIsActive(true);
  };

  const handleChangeComment = (
    еvent: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(еvent.target.value);
  };

  const handleCancel = () => {
    setComment(emptyComment);
    setIsActive(false);
  };

  return (
    <div className={styles.wrapper}>
      <CreateComment
        isActive={isActive}
        handleIsActive={handleIsActive}
        handleChangeComment={handleChangeComment}
        handleCancel={handleCancel}
        comment={comment}
      />
      <Comment />
    </div>
  );
};

export default Wrapper;
