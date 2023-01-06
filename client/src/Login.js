const LOGIN_URI =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8888/login'
    : 'https://heroku-socials-app-attempt-1.herokuapp.com/login';

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
