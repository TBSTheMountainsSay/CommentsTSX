import { useEffect, useRef } from 'react';

const useClickAway = (handleClickAway: () => void) => {
  const refElement = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!refElement.current) return;
      if (refElement.current.contains(target)) return;
      handleClickAway();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handleClickAway, refElement]);
  return refElement;
};

export default useClickAway;
