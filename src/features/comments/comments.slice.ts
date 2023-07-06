import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TComment } from './Comments.types';
import { AppThunk, RootState } from 'src/app/store';
import { reactionToggle } from 'src/helpers/helpers';
import { commentsAPI } from '../../api/commentsAPI/commentsAPI';
import { TAddCommentRequest } from '../../api/commentsAPI/commentsAPI.types';

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
    builder.addCase(addCommentThunk.fulfilled, (state, action) => {
      state.comments.push(action.payload);
    });
    builder.addCase(saveEditCommentThunk.fulfilled, (state, action) => {
      state.comments = state.comments.map((comment) =>
        comment.id === action.payload.id ? action.payload : comment
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

export const likeThunk =
  (id: number): AppThunk =>
  (dispatch, getState) => {
    const userId = getState().app.userId;
    const comment = getState().commentsReducer.comments.find(
      (comment) => comment.id === id
    );
    if (!comment) return;
    const newComment = {
      ...comment,
      likes: reactionToggle(comment.likes, userId),
      dislikes: comment.dislikes.includes(userId)
        ? reactionToggle(comment.dislikes, userId)
        : comment.dislikes,
    };
    dispatch(saveEditCommentThunk(newComment));
  };

export const dislikeThunk =
  (id: number): AppThunk =>
  (dispatch, getState) => {
    const userId = getState().app.userId;
    const comment = getState().commentsReducer.comments.find(
      (comment) => comment.id === id
    );
    if (!comment) return;
    const newComment = {
      ...comment,
      dislikes: reactionToggle(comment.dislikes, userId),
      likes: comment.likes.includes(userId)
        ? reactionToggle(comment.likes, userId)
        : comment.likes,
    };
    dispatch(saveEditCommentThunk(newComment));
  };

export const saveEditThunk =
  (id: number): AppThunk =>
  (dispatch, getState) => {
    const comment = getState().commentsReducer.editComments.find(
      (editComment) => editComment.id === id
    );
    if (!comment) {
      return;
    }
    dispatch(saveEditCommentThunk({ ...comment, edited: true }));
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

export const addCommentThunk = createAsyncThunk(
  'commentReducer/addCommentThunk',
  async (_, thunkAPI) => {
    const globalState = thunkAPI.getState() as RootState;
    const comment = {
      name: 'Ваня',
      lastName: 'Пашкин',
      data: globalState.commentsReducer.commentData,
      likes: [],
      dislikes: [],
      date: new Date(),
      edited: false,
    };
    try {
      const { data } = await commentsAPI.addComment(comment);
      thunkAPI.dispatch(changeCommentData(''));
      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const saveEditCommentThunk = createAsyncThunk(
  'commentReducer/saveEditCommentThunk',
  async (comment: TComment, thunkAPI) => {
    try {
      const { data } = await commentsAPI.saveEditComment(comment.id, {
        ...comment,
      });
      thunkAPI.dispatch(cancelEdit(comment.id));
      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export default commentsSlice.reducer;
