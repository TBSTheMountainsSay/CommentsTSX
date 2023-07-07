import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TComment } from './Comments.types';
import { AppThunk, RootState } from 'src/app/store';
import { toggleArray } from 'src/helpers/helpers';
import { commentsAPI } from '../../api/commentsAPI/commentsAPI';

export interface CommentsState {
  comments: TComment[];
  commentData: string;
  editComments: TComment[];
  meta: {
    fetching: boolean;
    creating: boolean;
    editing: number[];
    deleting: number[];
  };
}

const initialState: CommentsState = {
  comments: [],
  commentData: '',
  editComments: [],
  meta: {
    fetching: false,
    creating: false,
    editing: [],
    deleting: [],
  },
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
              likes: toggleArray(comment.likes, action.payload.userId),
              dislikes: comment.dislikes.includes(action.payload.userId)
                ? toggleArray(comment.dislikes, action.payload.userId)
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
              dislikes: toggleArray(comment.dislikes, action.payload.userId),
              likes: comment.likes.includes(action.payload.userId)
                ? toggleArray(comment.likes, action.payload.userId)
                : comment.likes,
            }
          : comment
      );
    },

    toggleEditing: (state, action: PayloadAction<number>) => {
      state.meta.editing = toggleArray(state.meta.editing, action.payload);
    },

    toggleDeleting: (state, action: PayloadAction<number>) => {
      state.meta.deleting = toggleArray(state.meta.deleting, action.payload);
    },
  },

  extraReducers: (builder) => {
    //FETCH
    builder.addCase(getCommentsThunk.pending, (state) => {
      state.meta.fetching = true;
    });

    builder.addCase(getCommentsThunk.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.comments = action.payload;
      state.meta.fetching = false;
    });

    //CREATE
    builder.addCase(addCommentThunk.pending, (state) => {
      state.meta.creating = true;
    });

    builder.addCase(addCommentThunk.fulfilled, (state, action) => {
      state.comments.push(action.payload);
      state.meta.creating = false;
    });

    //EDIT
    builder.addCase(saveEditCommentThunk.fulfilled, (state, action) => {
      state.comments = state.comments.map((comment) =>
        comment.id === action.payload.id ? action.payload : comment
      );
    });

    //DELETE
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
  toggleEditing,
  toggleDeleting,
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
      likes: toggleArray(comment.likes, userId),
      dislikes: comment.dislikes.includes(userId)
        ? toggleArray(comment.dislikes, userId)
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
      dislikes: toggleArray(comment.dislikes, userId),
      likes: comment.likes.includes(userId)
        ? toggleArray(comment.likes, userId)
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
    dispatch(toggleEditing(id));
    dispatch(saveEditCommentThunk({ ...comment, edited: true }))
      .unwrap()
      .then(() => dispatch(toggleEditing(id)))
      .catch(() => dispatch(toggleEditing(id)));
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
      thunkAPI.dispatch(toggleDeleting(id));
      await commentsAPI.deleteComment(id);
      thunkAPI.dispatch(toggleDeleting(id));
      return id;
    } catch (e: any) {
      thunkAPI.dispatch(toggleDeleting(id));
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
