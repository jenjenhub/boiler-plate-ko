import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <BrowserRouter>

      <div>
      <ul>
          <li>
            <Link to="/">LandingPage</Link>
          </li>
          <li>
            <Link to="/login">LoginPage</Link>
          </li>
          <li>
            <Link to="/register">RegisterPage</Link>
          </li>
        </ul>

        <hr />
   
        <Routes>
          <Route exact={true} path={"/"} element={<LandingPage />} />
          <Route exact={true} path={"/login"} element={<LoginPage />} />
          <Route exact={true} path={"/register"} element={<RegisterPage />}/>
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
