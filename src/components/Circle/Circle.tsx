import React from 'react';
import styles from './Circle.module.scss';

type TCircleProps = {};

const Circle: React.FC<TCircleProps> = ({}) => {
  return <div className={styles.circle}></div>;
};

export default Circle;
