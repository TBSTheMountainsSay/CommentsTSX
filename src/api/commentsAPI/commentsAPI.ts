import { axiosInstance } from '../index';
import {
  TAddCommentRequest,
  TAddCommentResponse,
  TGetCommentsResponse,
} from './commentsAPI.types';

export const commentsAPI = {
  getComments: () => axiosInstance.get<TGetCommentsResponse>('comments'),
  deleteComment: (id: number) => axiosInstance.delete(`comments/${id}`),
  addComment: (comment: TAddCommentRequest) =>
    axiosInstance.post<TAddCommentResponse>('comments', comment),
  saveEditComment: (id: number, comment: TAddCommentRequest) =>
    axiosInstance.put<TAddCommentResponse>(`comments/${id}`, comment),
};
