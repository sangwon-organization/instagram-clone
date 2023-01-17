import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
    ${reset};
    * {
        box-sizing: border-box;
    };
    html {
        background: ${({ theme }: any) => theme.bgColor};
    };
    body{
        padding: 0;
        margin: 0;
        font-family: "RobotoFont", sans-serif;
        
    };
    button{
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        outline: none;
    };
    input{
        display: flex;
        outline: none;
        padding-left: 10px;
    }
`;

export default GlobalStyle;
