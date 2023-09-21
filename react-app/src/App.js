import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
<<<<<<< HEAD
import PortfolioPage from "./components/PortfolioPage";
=======
import LandingPage from "./components/LandingPage";
>>>>>>> e4f3758a3ccbfcba347ff2b2c86d072c5a8e5e2b

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <LandingPage />
          </Route>
          <Route path="/portfolio">
            <PortfolioPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
