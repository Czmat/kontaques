import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import { connect } from 'react-redux';
import Dashboard from './pages/Dashboard';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducers from './redux/rootReducer';
import firebase from './firebase/firebase';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

function PrivateRoute({ children, ...rest }) {
  //   return (
  //     <Route
  //       {...rest}
  //       render={({ location }) =>
  //         auth ? (
  //           children
  //         ) : (
  //           <Redirect
  //             to={{
  //               pathname: '/login',
  //               state: { from: location },
  //             }}
  //           />
  //         )
  //       }
  //     />
  //   );
}
