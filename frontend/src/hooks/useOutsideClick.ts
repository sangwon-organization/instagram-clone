import { useEffect } from 'react';

const useOutsideClick = (
  ref: React.MutableRefObject<HTMLElement>,
  callback: Function,
) => {
  const handleClickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.currentTarget)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  });
};

export default useOutsideClick;
