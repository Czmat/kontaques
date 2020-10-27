import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { loadGmailApi } from './gmail/Gmail';
import CreateContacts from './components/createContacts';
import ContactData from "./pages/ContactData/ContactData";

function App() {
  useEffect(() => {
    loadGmailApi();
  }, []);
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
            <CreateContacts />
          </Route>
          <Route path="/contact-data" component={ContactData} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
