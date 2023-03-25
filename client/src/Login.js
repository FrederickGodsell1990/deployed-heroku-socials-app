// this login var works
// const LOGIN_URI =
//   process.env.NODE_ENV !== 'production'
//     ? 'http://localhost:8888/login'
//     : 'https://heroku-socials-app-staging.herokuapp.com/login';

    let LOGIN_URI;

    if (process.env.NODE_ENV === 'development') {
      LOGIN_URI =  'http://localhost:8888/login'
    }
    if (process.env.NODE_ENV === 'staging') { 
      LOGIN_URI =  'https://heroku-socials-app-staging.herokuapp.com/login';
    }
    if (process.env.NODE_ENV === 'production'){
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
