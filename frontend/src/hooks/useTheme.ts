import { useCallback, useLayoutEffect, useState } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('light');

  const onChangeTheme = useCallback(() => {
    const updatedTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(updatedTheme);
    localStorage.setItem('theme', updatedTheme);
  }, [theme]);

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  return {
    theme,
    onChangeTheme,
  };
};

export default useTheme;
