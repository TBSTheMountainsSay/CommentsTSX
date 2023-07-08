import moment from 'moment';

export const toggleArray = (array: number[], id: number) => {
  if (array.includes(id)) {
    return array.filter((currentId) => currentId !== id);
  } else {
    return [...array, id];
  }
};

export const timeFrom = (date: Date): string => {
  const formattedDate = moment(date);
  return formattedDate.fromNow();
};
