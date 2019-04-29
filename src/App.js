// React
import React from 'react';
import { Route } from 'react-router';

// Custom libs
import { Scrollbars } from 'react-custom-scrollbars';

// View components
import { Layout } from './components/Layout';
import { IndexView } from './components/IndexView/IndexView';
import LoginView from './components/AuthView/LoginView';
import { RegisterView } from './components/AuthView/RegisterView';
import { ErrorView } from './components/ErrorView/ErrorView';
import ProfileView from './components/ChatView/ProfileView';
import ChatOverview from './components/ChatView/ChatOverview';

window.randomGen = '_' + Math.random().toString(36).substr(2, 16);;

function App() {
  return (
    <Scrollbars id="scrollbars-container" className="full-window">
      <Layout>
        <Route exact path='/' component={IndexView} />
        <Route exact path='/login' component={LoginView} />
        <Route exact path='/register' component={RegisterView} />
        <Route exact path='/error' component={ErrorView} />
        <Route exact path='/chat' component={ChatOverview} />
        <Route exact path='/profile' component={ProfileView} />
      </Layout>
    </Scrollbars>
  );
}

export default App;
