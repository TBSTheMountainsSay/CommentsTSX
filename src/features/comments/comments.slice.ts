import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TComment } from './Comments.types';
import { AppThunk } from 'src/app/store';
import { reactionToggle } from 'src/helpers/helpers';

export interface CommentsState {
  comments: TComment[];
  commentData: string;
  editComments: TComment[];
}

const initialState: CommentsState = {
  comments: [
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
  ],
  commentData: '',
  editComments: [],
};

export const commentsSlice = createSlice({
  name: 'commentsReducer',
  initialState,
  reducers: {
    deleteComment: (state, action: PayloadAction<number>) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );
    },
    changeCommentData: (state, action: PayloadAction<string>) => {
      state.commentData = action.payload;
    },
    addComment: (state) => {
      const lastCommentIndex = state.comments.length - 1;
      const lastComment = state.comments[lastCommentIndex];
      const emptyObj = {
        id: lastComment.id + 1,
        name: 'Ваня',
        lastName: 'Пашкин',
        data: state.commentData,
        likes: [],
        dislikes: [],
      };
      state.comments.push(emptyObj);
    },
    ToggleEditComment: (state, action: PayloadAction<number>) => {
      const newComment = state.comments.find(
        (comment) => comment.id === action.payload
      );
      if (newComment == undefined) return;
      state.editComments.push(newComment);
    },
    editCommentData: (
      state,
      action: PayloadAction<{ id: number; commentData: string }>
    ) => {
      state.editComments = state.editComments.map((editComment) =>
        editComment.id === action.payload.id
          ? { ...editComment, data: action.payload.commentData }
          : editComment
      );
    },
    cancelEdit: (state, action: PayloadAction<number>) => {
      state.editComments = state.editComments.filter(
        (editComment) => editComment.id !== action.payload
      );
    },
    saveEdit: (state, action: PayloadAction<number>) => {
      state.comments = state.comments.map((comment) => {
        const editComment = state.editComments.find(
          (editComment) => editComment.id === comment.id
        );
        if (comment.id === action.payload && editComment) return editComment;
        return comment;
      });
    },
    like: (state, action: PayloadAction<{ id: number; userId: number }>) => {
      state.comments = state.comments.map((comment) =>
        comment.id === action.payload.id
          ? {
              ...comment,
              likes: reactionToggle(comment.likes, action.payload.userId),
              dislikes: comment.dislikes.includes(action.payload.userId)
                ? reactionToggle(comment.dislikes, action.payload.userId)
                : comment.dislikes,
            }
          : comment
      );
    },
    dislike: (state, action: PayloadAction<{ id: number; userId: number }>) => {
      state.comments = state.comments.map((comment) =>
        comment.id === action.payload.id
          ? {
              ...comment,
              dislikes: reactionToggle(comment.dislikes, action.payload.userId),
              likes: comment.likes.includes(action.payload.userId)
                ? reactionToggle(comment.likes, action.payload.userId)
                : comment.likes,
            }
          : comment
      );
    },
  },
});

export const {
  deleteComment,
  changeCommentData,
  ToggleEditComment,
  editCommentData,
  cancelEdit,
} = commentsSlice.actions;

const { addComment, saveEdit, like, dislike } = commentsSlice.actions;

export const addCommentThunk = (): AppThunk => (dispatch, getState) => {
  dispatch(addComment());
  dispatch(changeCommentData(''));
};

export const saveCommentThunk =
  (id: number): AppThunk =>
  (dispatch, getState) => {
    dispatch(saveEdit(id));
    dispatch(cancelEdit(id));
  };

export const likeThunk =
  (id: number): AppThunk =>
  (dispatch, getState) => {
    const userId = getState().app.userId;
    dispatch(like({ id, userId }));
  };

export const dislikeThunk =
  (id: number): AppThunk =>
  (dispatch, getState) => {
    const userId = getState().app.userId;
    dispatch(dislike({ id, userId }));
  };

export default commentsSlice.reducer;
