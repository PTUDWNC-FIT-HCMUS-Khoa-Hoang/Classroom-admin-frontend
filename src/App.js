import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Footer from './components/shared/Footer';
import NavBar from './components/shared/NavBar';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import ClassroomList from './pages/Classrooms/ClassroomList';

function App() {
  //#region Redux hooks
  const auth = useSelector((state) => state.auth);
  //#endregion

  return (
    <div>
      <Layout className="layout">
        <BrowserRouter>
          <NavBar />
          <Layout.Content style={{ padding: '0 50px', minHeight: '100vh' }}>
            {auth.status !== 'success' ? (
              <Switch>
                <Route exact path="/register" component={RegisterPage} />
                <Route path="*" component={LoginPage} />
              </Switch>
            ) : (
              <Switch>
                <Route exact path="/courses" component={ClassroomList} />
              </Switch>
            )}
          </Layout.Content>
          <Footer />
        </BrowserRouter>
      </Layout>
    </div>
  );
}

export default App;
