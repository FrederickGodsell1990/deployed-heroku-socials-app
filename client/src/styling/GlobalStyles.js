import { createGlobalStyle } from "styled-components/macro";
import variables from "./variables";

const GlobalStyle = createGlobalStyle`

  ${variables};

 
  p, span {
    /* Apply your text styles here */
    color: rgb(255,255,255);
    font-size: 16px;
    font-family: 'Poppins', sans-serif;
  }

h1, h2, h3, h4, h5, h6 {
    /* Apply your text styles here */
    font-weight: bold;
    color: rgb(255,255,255);
  ;
    font-family: 'Poppins', sans-serif;
  }


  body {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  button {
  
    cursor: pointer;
   border : 0;
    border-radius: var(--border-radius-pill);
    color: #fff;
    background-color: rgb(119, 119, 119);
font-family: 'Poppins', sans-serif;
    padding: var(--spacing-xs) var(--spacing-sm);

 
  }

  .app {
    min-height: 100vh;
  }

`;

export default GlobalStyle;
