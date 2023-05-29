import React, { useState } from 'react';
import styles from './Comments.module.scss';
import CreateComment from './CreateComment/CreateComment';
import Comment from '../../components/Comment/Comment';
import { TComment } from './Comments.types';

type TWrapperProps = {};

const Comments: React.FC<TWrapperProps> = ({}) => {
  const initialState = [
    {
      id: 0,
      name: 'Паша',
      lastName: 'Ванин',
      data: 'Значит так: value, то бишь  каждый символ в textarea, мы берем из BLL, в стейте. Делаем мы это через props. Чтобы добавить каждый символ в стейт, т.е. наше value, мы используем обработчик onChange. Программируем наш onChange, чтобы value (символ который мы  нажали) передавался в стейт. Делаем это через функцию update, которая должна лежать со стейтом в BLL. Прокидываем эту функцию через props в нашу компоненту. В обработчике пишем,  вызови update(со значением value(символ)). т. е. то, что мы ввели, через функцию записывается в какой-то массив в стейте. А textarea говорит: О! Сейчас кто-то ввел символ и  мой value стал тем, что ввели. Быстренько отображаю это, в поле ввода. Получается, сначала поменялся state в BLL, а потом Ui в textarea. Это концепция Flux архитектуры.',
      like: 100,
      dislike: 10,
    },
  ];

  const [comments, setComments] = useState<TComment[]>(initialState);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  const emptyComment: string = '';

  const emptyObj = {
    id: 1,
    name: 'Ваня',
    lastName: 'Пашкин',
    data: comment,
    like: 10,
    dislike: 2,
  };

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

  const handleAddComment = () => {
    setComments([...comments, emptyObj]);
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
        handleAddComment={handleAddComment}
      />
      <ul>
        {comments.map((comment) => (
          <Comment
            id={comment.id}
            name={comment.name}
            lastName={comment.lastName}
            data={comment.data}
            key={comment.id}
            like={comment.like}
            dislike={comment.dislike}
          />
        ))}
      </ul>
    </div>
  );
};

export default Comments;
