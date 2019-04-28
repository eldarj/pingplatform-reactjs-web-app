import React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';

import { Scrollbars } from 'react-custom-scrollbars';

import { IndexView } from './components/IndexView/IndexView';
import { LoginView } from './components/AuthView/LoginView';
import { RegisterView } from './components/AuthView/RegisterView';
import { ErrorView } from './components/ErrorView/ErrorView';
import { ProfileView } from './components/ChatView/ProfileView';
import { ChatOverview } from './components/ChatView/ChatOverview';

function App() {
  return (
    <Scrollbars className="full-window">
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
