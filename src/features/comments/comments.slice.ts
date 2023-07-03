import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TComment } from './Comments.types';
import { AppThunk } from 'src/app/store';
import { reactionToggle } from 'src/helpers/helpers';
import { commentsAPI } from '../../api/commentsAPI/commentsAPI';

export interface CommentsState {
  comments: TComment[];
  commentData: string;
  editComments: TComment[];
}

const initialState: CommentsState = {
  comments: [],
  commentData: '',
  editComments: [],
};

export const commentsSlice = createSlice({
  name: 'commentsReducer',
  initialState,
  reducers: {
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
        date: new Date(),
        edited: false,
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
        if (!editComment || comment.id !== action.payload) return comment;
        editComment.edited = true;
        return editComment;
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
  extraReducers: (builder) => {
    builder.addCase(getCommentsThunk.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.comments = action.payload;
    });

    builder.addCase(deleteCommentThunk.fulfilled, (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );
    });
  },
});

export const {
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

export const getCommentsThunk = createAsyncThunk(
  'commentsReducer/getCommentsThunk',
  async (_, thunkAPI) => {
    try {
      const { data } = await commentsAPI.getComments();
      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  'commentReducer/deleteCommentThunk',
  async (id: number, thunkAPI) => {
    try {
      await commentsAPI.deleteComment(id);
      return id;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export default commentsSlice.reducer;
