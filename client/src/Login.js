

    let LOGIN_URI;
// if statements assigns value to 'LOGIN_URI' depending on which environment is being used, local or different 
// heroku environments
    if (process.env.NODE_ENV === 'development') {
      LOGIN_URI =  'http://localhost:8888/login'
    }
    if (process.env.REACT_APP_ENV === 'staging') {
      LOGIN_URI =  'https://heroku-socials-app-staging.herokuapp.com/login';
    }
    if (process.env.REACT_APP_ENV === 'production'){
      LOGIN_URI =  'https://heroku-socials-app-attempt-1.herokuapp.com/login';
    }


const Login = () => {
  return (
    <>
      <a className="App-link" href={LOGIN_URI}>
        Log in to Spotify
      </a>
    </>
  );
};

export default Login;
