export const reactionToggle = (likes: number[], userId: number) => {
  if (likes.includes(userId)) {
    return likes.filter((id) => userId !== id);
  } else {
    return [...likes, userId];
  }
};
