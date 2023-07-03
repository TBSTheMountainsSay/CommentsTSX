import { axiosInstance } from '../index';
import { TCommentsResponse } from './commentsAPI.types';

export const commentsAPI = {
  getComments: () => axiosInstance.get<TCommentsResponse>('comments'),
  deleteComment: (id: number) => axiosInstance.delete(`comments/${id}`),
};
