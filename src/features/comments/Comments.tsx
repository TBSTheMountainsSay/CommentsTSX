import React, { useState } from 'react';
import styles from './Comments.module.scss';
import CreateComment from './CreateComment/CreateComment';
import Comment from '../../components/Comment/Comment';
import { TComment } from './Comments.types';
import { useThemeDetector } from '../../hooks/useThemeDetector';
import SvgSelector from '../../components/SvgSelector/SvgSelector';
import clsx from 'clsx';
import { useBubbles } from '../../hooks/useBubble';

type TWrapperProps = {};

const Comments: React.FC<TWrapperProps> = ({}) => {
  const userId = 0;

  const initialState = [
    {
      id: 1,
      name: 'Паша',
      lastName: 'Ванин',
      data: 'Значит так: value, то бишь  каждый символ в textarea, мы берем из BLL, в стейте. Делаем мы это через props. Чтобы добавить каждый символ в стейт, т.е. наше value, мы используем обработчик onChange. Программируем наш onChange, чтобы value (символ который мы  нажали) передавался в стейт. Делаем это через функцию update, которая должна лежать со стейтом в BLL. Прокидываем эту функцию через props в нашу компоненту. В обработчике пишем,  вызови update(со значением value(символ)). т. е. то, что мы ввели, через функцию записывается в какой-то массив в стейте. А textarea говорит: О! Сейчас кто-то ввел символ и  мой value стал тем, что ввели. Быстренько отображаю это, в поле ввода. Получается, сначала поменялся state в BLL, а потом Ui в textarea. Это концепция Flux архитектуры.',
      likes: [0, 1, 3],
      dislikes: [2],
    },
    {
      id: 2,
      name: 'Никита',
      lastName: 'Широбоков',
      data: 'ПРОВЕРКА 1',
      likes: [1, 2],
      dislikes: [0, 3],
    },
    {
      id: 3,
      name: 'Андрей',
      lastName: 'Парыгин',
      data: 'ПРОВЕРКА 2',
      likes: [2, 3],
      dislikes: [1],
    },
  ];

  const { bubblesElement, startAnimation } = useBubbles();
  const systemTheme = useThemeDetector();
  const localStorageTheme = window.localStorage.getItem('isDarkTheme');
  const initialTheme = localStorageTheme || systemTheme;

  const [comments, setComments] = useState<TComment[]>(initialState);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [unicID, setInicID] = useState<number>(4);
  const [isActiveMenu, setIsActiveMenu] = useState<number | undefined>();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    initialTheme === 'dark'
  );
  document.documentElement.setAttribute(
    'color-scheme',
    isDarkTheme ? 'dark' : 'light'
  );

  const emptyComment: string = '';

  const emptyObj = {
    id: unicID,
    name: 'Ваня',
    lastName: 'Пашкин',
    data: comment,
    likes: [],
    dislikes: [],
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
    setInicID(unicID + 1);
  };

  const reactionToggle = (likes: number[]) => {
    if (likes.includes(userId)) {
      return likes.filter((id) => userId !== id);
    } else {
      return [...likes, userId];
    }
  };

  const handleLike = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              likes: reactionToggle(comment.likes),
              dislikes: comment.dislikes.includes(userId)
                ? reactionToggle(comment.dislikes)
                : comment.dislikes,
            }
          : comment
      )
    );
  };

  const handleDislike = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              dislikes: reactionToggle(comment.dislikes),
              likes: comment.likes.includes(userId)
                ? reactionToggle(comment.likes)
                : comment.likes,
            }
          : comment
      )
    );
  };

  const handleMenuButton = (id: number) => {
    id === isActiveMenu ? setIsActiveMenu(undefined) : setIsActiveMenu(id);
  };

  const handleChangeTheme = () => {
    startAnimation();
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    window.localStorage.setItem('isDarkTheme', newTheme ? 'dark' : 'light');
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div className={styles.wrapper}>
      <div className={clsx('wrapper', styles.theme_switch_wrapper)}>
        <button onClick={handleChangeTheme}>
          <SvgSelector
            id={isDarkTheme ? 'dark_mode' : 'light_mode'}
            className={styles.theme_switch}
          />
        </button>
        {bubblesElement}
      </div>
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
            isActiveMenu={isActiveMenu === comment.id}
            id={comment.id}
            name={comment.name}
            lastName={comment.lastName}
            data={comment.data}
            key={comment.id}
            likes={comment.likes}
            dislikes={comment.dislikes}
            handleLike={() => handleLike(comment.id)}
            handleDislike={() => handleDislike(comment.id)}
            handleMenuButton={() => handleMenuButton(comment.id)}
            handleDeleteComment={() => handleDeleteComment(comment.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Comments;
