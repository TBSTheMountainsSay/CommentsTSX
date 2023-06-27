import React, { useCallback, useState } from 'react';
import styles from './Comments.module.scss';
import CreateComment from './CreateComment/CreateComment';
import Comment from '../../components/Comment/Comment';
import { TComment } from './Comments.types';
import { useThemeDetector } from '../../hooks/useThemeDetector';
import { useBubbles } from '../../hooks/useBubble';
import LanguagesSwitcher from '../../components/Buttons/LanguageSwitcher/LanguagesSwitcher';
import ThemeSwitcher from '../../components/Buttons/ThemeSwitcher/ThemeSwitcher';
import { TLanguage } from '../../app.slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addComment,
  addCommentThunk,
  changeCommentData,
  deleteComment,
} from './comments.slice';

type TCommentsProps = {
  language: TLanguage;
  handleChangeLanguage: () => void;
};

const Comments: React.FC<TCommentsProps> = ({
  handleChangeLanguage,
  language,
}) => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.app.userId);

  const comments2 = useAppSelector((state) => state.commentsReducer.comments);

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

  const commentData = useAppSelector(
    (state) => state.commentsReducer.commentData
  );

  const [unicID, setInicID] = useState<number>(4);
  const [isActiveMenu, setIsActiveMenu] = useState<number | undefined>();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    initialTheme === 'dark'
  );
  document.documentElement.setAttribute(
    'color-scheme',
    isDarkTheme ? 'dark' : 'light'
  );

  const [editComments, setEditComments] = useState<TComment[]>([]);

  const emptyComment: string = '';

  const emptyObj = {
    id: unicID,
    name: 'Ваня',
    lastName: 'Пашкин',
    data: commentData,
    likes: [],
    dislikes: [],
  };

  const handleIsActive = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleChangeComment = useCallback(
    (еvent: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(changeCommentData(еvent.target.value));
    },
    []
  );

  const handleCancel = useCallback(() => {
    // setCommentData(emptyComment);
    setIsActive(false);
  }, []);

  const handleAddComment = useCallback(() => {
    dispatch(addCommentThunk());
    setIsActive(false);
  }, []);

  const reactionToggle = useCallback(
    (likes: number[]) => {
      if (likes.includes(userId)) {
        return likes.filter((id) => userId !== id);
      } else {
        return [...likes, userId];
      }
    },
    [userId]
  );

  const handleLike = useCallback(
    (id: number) => {
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
    },
    [comments, reactionToggle]
  );

  const handleDislike = useCallback(
    (id: number) => {
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
    },
    [comments, reactionToggle]
  );

  const handleMenuButton = useCallback(
    (id: number) => {
      id === isActiveMenu ? setIsActiveMenu(undefined) : setIsActiveMenu(id);
    },
    [isActiveMenu]
  );

  const handleChangeTheme = useCallback(() => {
    startAnimation();
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    window.localStorage.setItem('isDarkTheme', newTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const handleDeleteComment = useCallback((id: number) => {
    dispatch(deleteComment(id));
  }, []);

  const handleToggleEditComment = (id: number) => {
    const newComment = comments.find((comment) => comment.id === id);
    if (newComment == undefined) return;
    setEditComments([...editComments, newComment]);
  };

  const handleEditCommentData = (
    id: number,
    еvent: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditComments(
      editComments.map((editComment) =>
        editComment.id === id
          ? { ...editComment, data: еvent.target.value }
          : editComment
      )
    );
  };

  const handleCancelEdit = (id: number) => {
    setEditComments(
      editComments.filter((editComment) => editComment.id !== id)
    );
  };

  const handleSaveEdit = (id: number) => {
    setComments(
      comments.map((comment) => {
        const editComment = editComments.find(
          (editComment) => editComment.id === comment.id
        );
        if (comment.id === id && editComment) return editComment;
        return comment;
      })
    );
    handleCancelEdit(id);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttons}>
        <LanguagesSwitcher
          handleChangeLanguage={handleChangeLanguage}
          language={language}
        />
        <ThemeSwitcher
          handleChangeTheme={handleChangeTheme}
          isDarkTheme={isDarkTheme}
        />
      </div>

      <CreateComment
        isActive={isActive}
        handleIsActive={handleIsActive}
        handleChangeComment={handleChangeComment}
        handleCancel={handleCancel}
        comment={commentData}
        handleAddComment={handleAddComment}
      />
      <ul>
        {comments2.map((comment) => {
          const editComment = editComments.find(
            (eComment) => eComment.id === comment.id
          );
          return editComment ? (
            <CreateComment
              isActive
              handleChangeComment={(event) => {
                handleEditCommentData(comment.id, event);
              }}
              handleCancel={() => {
                handleCancelEdit(editComment.id);
              }}
              comment={editComment.data}
              handleAddComment={() => {
                handleSaveEdit(comment.id);
              }}
              isEdit={true}
            />
          ) : (
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
              handleEditComment={() => handleToggleEditComment(comment.id)}
              userId={userId}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Comments;
