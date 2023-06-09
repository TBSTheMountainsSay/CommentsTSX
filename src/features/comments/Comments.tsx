import React, { useCallback, useEffect, useState } from 'react';
import styles from './Comments.module.scss';
import CreateComment from './CreateComment/CreateComment';
import Comment from 'src/components/Comment/Comment';
import { useThemeDetector } from 'src/hooks/useThemeDetector';
import LanguagesSwitcher from 'src/components/Buttons/LanguageSwitcher/LanguagesSwitcher';
import ThemeSwitcher from 'src/components/Buttons/ThemeSwitcher/ThemeSwitcher';
import { TLanguage } from 'src/app.slice';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import {
  addCommentThunk,
  cancelEdit,
  changeCommentData,
  deleteCommentThunk,
  dislikeThunk,
  editCommentData,
  getCommentsThunk,
  likeThunk,
  saveEditThunk,
  ToggleEditComment,
} from './comments.slice';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import SvgSelector from '../../components/SvgSelector/SvgSelector';

type TCommentsProps = {
  language: TLanguage;
  handleChangeLanguage: () => void;
  intl: any;
};

const Comments: React.FC<TCommentsProps> = ({
  handleChangeLanguage,
  language,
  intl,
}) => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.app.userId);
  const comments = useAppSelector((state) => state.commentsReducer.comments);
  const editComments = useAppSelector(
    (state) => state.commentsReducer.editComments
  );
  const commentData = useAppSelector(
    (state) => state.commentsReducer.commentData
  );

  const meta = useAppSelector((state) => state.commentsReducer.meta);

  const systemTheme = useThemeDetector();
  const localStorageTheme = window.localStorage.getItem('isDarkTheme');
  const initialTheme = localStorageTheme || systemTheme;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isActiveMenu, setIsActiveMenu] = useState<number | undefined>();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    initialTheme === 'dark'
  );
  document.documentElement.setAttribute(
    'color-scheme',
    isDarkTheme ? 'dark' : 'light'
  );

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
    dispatch(changeCommentData(''));
    setIsActive(false);
  }, []);

  const handleAddComment = useCallback(() => {
    dispatch(addCommentThunk());
    setIsActive(false);
  }, []);

  const handleLike = useCallback((id: number) => {
    dispatch(likeThunk(id));
  }, []);

  const handleDislike = useCallback((id: number) => {
    dispatch(dislikeThunk(id));
  }, []);

  const handleMenuButton = useCallback(
    (id: number) => {
      id === isActiveMenu ? setIsActiveMenu(undefined) : setIsActiveMenu(id);
    },
    [isActiveMenu]
  );

  const handleChangeTheme = useCallback(() => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    window.localStorage.setItem('isDarkTheme', newTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const handleDeleteComment = useCallback((id: number) => {
    dispatch(deleteCommentThunk(id));
  }, []);

  const handleToggleEditComment = useCallback((id: number) => {
    dispatch(ToggleEditComment(id));
  }, []);

  const handleEditCommentData = useCallback(
    (id: number, еvent: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(editCommentData({ id, commentData: еvent.target.value }));
    },
    []
  );

  const handleCancelEdit = useCallback((id: number) => {
    dispatch(cancelEdit(id));
  }, []);

  const handleSaveEdit = useCallback((id: number) => {
    dispatch(saveEditThunk(id));
  }, []);

  moment.updateLocale(language, {
    relativeTime: {
      future: intl.formatMessage({ id: 'time.future' }),
      past: intl.formatMessage({ id: 'time.past' }),
      s: intl.formatMessage({ id: 'time.s' }),
      ss: intl.formatMessage({ id: 'time.ss' }),
      m: intl.formatMessage({ id: 'time.m' }),
      mm: intl.formatMessage({ id: 'time.mm' }),
      h: intl.formatMessage({ id: 'time.h' }),
      hh: intl.formatMessage({ id: 'time.hh' }),
      d: intl.formatMessage({ id: 'time.d' }),
      dd: intl.formatMessage({ id: 'time.dd' }),
      w: intl.formatMessage({ id: 'time.w' }),
      ww: intl.formatMessage({ id: 'time.ww' }),
      M: intl.formatMessage({ id: 'time.M' }),
      MM: intl.formatMessage({ id: 'time.MM' }),
      y: intl.formatMessage({ id: 'time.y' }),
      yy: intl.formatMessage({ id: 'time.yy' }),
    },
  });

  useEffect(() => {
    dispatch(getCommentsThunk());
  }, []);

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

      {meta.creating || meta.fetching ? (
        <SvgSelector id={'preloader'} className={'svg-preloader'} />
      ) : (
        <CreateComment
          isActive={isActive}
          handleIsActive={handleIsActive}
          handleChangeComment={handleChangeComment}
          handleCancel={handleCancel}
          comment={commentData}
          handleAddComment={handleAddComment}
        />
      )}
      <ul>
        {comments.map((comment) => {
          const editComment = editComments.find(
            (eComment) => eComment.id === comment.id
          );

          if (
            meta.editing.includes(comment.id) ||
            meta.deleting.includes(comment.id)
          )
            return (
              <div className={styles['preloader-container']}>
                <SvgSelector id={'preloader'} className={'svg-preloader'} />
              </div>
            );

          if (editComment)
            return (
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
            );

          return (
            <Comment
              isActiveMenu={isActiveMenu === comment.id}
              id={comment.id}
              name={comment.name}
              lastName={comment.lastName}
              data={comment.data}
              key={comment.id}
              likes={comment.likes}
              dislikes={comment.dislikes}
              date={comment.date}
              edited={comment.edited}
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

export default injectIntl(Comments);
