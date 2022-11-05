import 'styled-components';
import { ColorsTypes } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ColorsTypes;
    flexCenter: ThemedCssFunction;
    lightTheme: LightThemeTypes;
    darkTheme: DarkThemeTypes;
  }
}
