import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import PortfolioPage from "./components/PortfolioPage";
import LandingPage from "./components/LandingPage";
import StockDetails from "./components/StockDetailsPage";

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
          <Route path='/stocks/:ticker'>
            <StockDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
