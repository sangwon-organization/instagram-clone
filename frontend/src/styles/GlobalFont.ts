import { createGlobalStyle } from 'styled-components';
import RobotoThin from '../assets/font/RobotoThin.woff';
import RobotoLight from '../assets/font/RobotoLight.woff';
import RobotoRegular from '../assets/font/RobotoRegular.woff';
import RobotoMedium from '../assets/font/RobotoMedium.woff';
import RobotoBold from '../assets/font/RobotoBold.woff';
import RobotoBlack from '../assets/font/RobotoBlack.woff';

export default createGlobalStyle`
    @font-face {
        font-family: "RobotoFont";
        src: url(${RobotoThin}) format('woff'); 
        font-weight: 100;
    }
    @font-face {
        font-family: "RobotoFont";
        src: url(${RobotoLight}) format('woff');
        font-weight: 300;
    }
    @font-face {
        font-family: "RobotoFont";
        src: url(${RobotoRegular}) format('woff');
        font-weight: 400;
    }
    @font-face {
        font-family: "RobotoFont";
        src: url(${RobotoMedium}) format('woff');
        font-weight: 500;
    }
    @font-face {
        font-family: "RobotoFont";
        src: url(${RobotoBold}) format('woff');
        font-weight: 700;
    }
    @font-face {
        font-family: "RobotoFont";
        src: url(${RobotoBlack}) format('woff');
        font-weight: 900;
    }
`;
