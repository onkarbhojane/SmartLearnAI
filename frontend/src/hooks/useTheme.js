import { useTheme as useThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
  const themeContext = useThemeContext();
  
  // Helper functions for conditional styling
  const themeClass = (lightClass, darkClass) => {
    return themeContext.theme === 'dark' ? darkClass : lightClass;
  };

  const themeValue = (lightValue, darkValue) => {
    return themeContext.theme === 'dark' ? darkValue : lightValue;
  };

  return {
    ...themeContext,
    themeClass,
    themeValue,
    isDark: themeContext.theme === 'dark',
    isLight: themeContext.theme === 'light'
  };
};