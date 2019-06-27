import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Route,
  Link,
  HashRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import { Grommet, Box, Heading, Button } from "grommet";
import { Notification } from "grommet-icons";

import "./main.css";
import CreateProfile from "./components/containers/CreateProfile";
import AppBar from "./components/AppBar";
// import AppBar from './components/AppBar';

const theme = {
  global: {
    breakpoints: {
      small: {
        value: "900"
      }
    },
    font: {
      family: "Raleway",
      size: "14px",
      height: "20px"
    }
  },
  heading: {
    font: {
      family: "Righteous"
    }
  }
};

const routing = (
  <Router>
    <Grommet theme={theme} full>
      <AppBar>
        <Box flex="grow" align="stretch" pad={{ top: "small" }}>
          <Heading level="3" margin="none">
            _ipseity
          </Heading>
          <p>
            <i>Your Enduring Self</i>
          </p>
        </Box>
      </AppBar>
      <Switch>
        <Route exact path="/" component={CreateProfile} />
      </Switch>
    </Grommet>
  </Router>
);

ReactDOM.render(routing, document.getElementById("main"));
