import { createGlobalStyle } from "styled-components/macro";
import variables from "./variables";

const GlobalStyle = createGlobalStyle`

  ${variables};

 


  body {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  button {
  
    cursor: pointer;
   border : 0;
    border-radius: var(--border-radius-pill);
    background-color: rgba(0,0,0,1);
    color: var(--white);
    padding: var(--spacing-xs) var(--spacing-sm);

 
  }

  .app {
    min-height: 100vh;
  }

`;

export default GlobalStyle;
