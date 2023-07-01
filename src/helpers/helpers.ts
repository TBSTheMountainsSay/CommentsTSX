import moment from 'moment';

export const reactionToggle = (likes: number[], userId: number) => {
  if (likes.includes(userId)) {
    return likes.filter((id) => userId !== id);
  } else {
    return [...likes, userId];
  }
};

export const timeFrom = (date: Date): string => {
  const formattedDate = moment(date);
  return formattedDate.fromNow();
};
