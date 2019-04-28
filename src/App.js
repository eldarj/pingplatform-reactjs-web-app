import React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { IndexView } from './components/IndexView/IndexView';
import { LoginView } from './components/AuthView/LoginView';
import { RegisterView } from './components/AuthView/RegisterView';

function App() {
  return (
    <Layout>
      <Route exact path='/' component={IndexView} />
      <Route exact path='/login' component={LoginView} />
      <Route exact path='/register' component={RegisterView} />
    </Layout>
  );
}

export default App;
