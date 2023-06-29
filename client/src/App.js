import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { accessToken } from "./Spotify";
import ArtistSearch from "./pages/ArtistSearch";
import Profile from "./pages/Profile";
import FavouriteArtistsFunction from "./pages/FavouriteArtistsFunction";
import GlobalStyle from "./styling/GlobalStyles";

import Login from "./Login.js";
import ReleaseRadarFunction from "./pages/ReleaseRadar";

function App() {
  const [token, setToken] = useState(null);

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
            <Router>
              <Routes>
                <Route path="/" element={<Profile />}></Route>
                <Route path="/playlist" element={<h1>Hi there</h1>}></Route>
                <Route path="/artist_search" element={<ArtistSearch />}></Route>
                <Route
                  path="/favourite_artists"
                  element={<FavouriteArtistsFunction />}
                ></Route>
                <Route
                  path="/release_radar"
                  element={<ReleaseRadarFunction />}
                ></Route>
              </Routes>
            </Router>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
