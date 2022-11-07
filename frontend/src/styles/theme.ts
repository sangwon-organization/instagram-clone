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
  lightModeHashTagColor: '#00376b;',
  lightModeSearchBarBgColor: '#ffffff',
  lightModeDropDownBgColor: '#ffffff',
  lightModeSearchBarInputColor: '#e6e6e6',

  // DarkMode
  darkModeBgColor: '#121212',
  darkModeBorderColor: '#363636',
  darkModeTextColor: '#fafafa',
  darkModeGreyTextColor: '#8e8e8e',
  darkModeFooterTextColor: '#737373',
  darkModeUltraLightGreyColor: '#CCD0D5',
  darkModeHashTagColor: '#e0f1ff;',
  darkModeSearchBarBgColor: '#000000',
  darkModeDropDownBgColor: '#262626',
  darkModeSearchBarInputColor: '#262626',
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
  hashTagColor: colors.lightModeHashTagColor,
  searchBarBgColor: colors.lightModeSearchBarBgColor,
  dropDownBgColor: colors.lightModeDropDownBgColor,
  searchBarInputColor: colors.lightModeSearchBarInputColor,
};

const darkTheme = {
  bgColor: colors.darkModeBgColor,
  borderColor: colors.darkModeBorderColor,
  textColor: colors.darkModeTextColor,
  greyTextColor: colors.darkModeGreyTextColor,
  footerTextColor: colors.darkModeFooterTextColor,
  ultraLightGreyColor: colors.darkModeUltraLightGreyColor,
  dropdownBgColor: colors.darkModeDropDownBgColor,
  hashTagColor: colors.darkModeHashTagColor,
  searchBarBgColor: colors.darkModeSearchBarBgColor,
  dropDownBgColor: colors.darkModeDropDownBgColor,
  searchBarInputColor: colors.darkModeSearchBarInputColor,
};

export type ColorsTypes = typeof colors;
export type flexCenterTypes = typeof flexCenter;
export type LightThemeTypes = typeof lightTheme;
export type DarkThemeTypes = typeof darkTheme;

export const theme = {
  colors,
  flexCenter,
  lightTheme,
  darkTheme,
};

export default theme;
