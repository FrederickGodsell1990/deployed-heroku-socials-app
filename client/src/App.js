import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import PlaylistsComponent from "./PlaylistsComponent.js";
import { accessToken, logout } from "./spotify";
import ArtistSearch from "./ArtistSearch";
import Profile from "./Profile"
import FavouriteArtistsFunction from "./FavouriteArtistsFunction"
import GlobalStyle  from "./styling/GlobalStyles";
import {LogOutButtonRight} from './styling/ComponentStyles.js';
import Login from "./Login.js"



function App() {
  const [token, setToken] = useState(null);
  const [dummyVar, dummyFunction] = useState(null);
 // added to see if dummy branch work
  useEffect(() => {
    setToken(accessToken);
  });

  return (
    <div className="App">
      <header className="App-header">
        <GlobalStyle />
        {!token ? (
          <Login />
        ) : (
          <>
         
            <LogOutButtonRight onClick={logout}>Log out</ LogOutButtonRight > 

            <Router>
              <Routes>
                <Route path="/" element={<Profile />}></Route>
                <Route path="/playlist" element={<h1>Hi there</h1>}></Route>
                <Route path="/artist_search" element={<ArtistSearch />}></Route>
                <Route path="/favourite_artists" element={<FavouriteArtistsFunction />}></Route>
              </Routes>
            </Router>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
