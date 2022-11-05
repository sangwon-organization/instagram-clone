import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
    ${reset};
    * {
        font-family: "RobotoFont", sans-serif;
        box-sizing: border-box;
    }
    body{
        padding: 0;
        margin: 0;
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
