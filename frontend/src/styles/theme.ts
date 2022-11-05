import { css, DefaultTheme } from 'styled-components';

const colors = {
  whiteColor: '#FFFFFF',
  blackColor: '#000000',

  // Point
  buttonColor: '#0095f6',
  errorColor: '#ED4956',

  // LightMode
  lightModeBgColor: '#fafafa',
  lightModeBorderColor: '#dbdbdb',
  lightModeTextColor: '#262626',
  lightModeGreyTextColor: '#8e8e8e',
  lightModeFooterTextColor: '#c7c7c7',
  lightModeUltraLightGreyColor: '#efefef',

  // DarkMode
  darkModeBgColor: '#121212',
  darkModeBorderColor: '#363636',
  darkModeTextColor: '#fafafa',
  darkModeDropDownBgColor: '#262626',
  darkModeGreyTextColor: '#8e8e8e',
  darkModeFooterTextColor: '#737373',
  darkModeUltraLightGreyColor: '#CCD0D5',
};

const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const lightTheme = {
  bgColor: colors.lightModeBgColor,
  borderColor: colors.lightModeBorderColor,
  textColor: colors.lightModeTextColor,
  greyTextColor: colors.lightModeGreyTextColor,
  footerTextColor: colors.lightModeFooterTextColor,
  ultraLightGreyColor: colors.lightModeUltraLightGreyColor,
};

const darkTheme = {
  bgColor: colors.darkModeBgColor,
  borderColor: colors.darkModeBorderColor,
  textColor: colors.darkModeTextColor,
  greyTextColor: colors.darkModeGreyTextColor,
  footerTextColor: colors.darkModeFooterTextColor,
  ultraLightGreyColor: colors.darkModeUltraLightGreyColor,
  dropdownBgColor: colors.darkModeDropDownBgColor,
};

export type ColorsTypes = typeof colors;
export type LightThemeTypes = typeof lightTheme;
export type DarkThemeTypes = typeof darkTheme;

export const theme: DefaultTheme = {
  colors,
  flexCenter,
  lightTheme,
  darkTheme,
};
