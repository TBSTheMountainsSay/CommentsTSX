import { TComment } from '../../features/comments/Comments.types';

export type TGetCommentsResponse = TComment[];

export type TAddCommentRequest = Omit<TComment, 'id'>;

export type TAddCommentResponse = TComment;
