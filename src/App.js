import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Footer from './components/shared/Footer';
import NavBar from './components/shared/NavBar';
import AccountAddPage from './pages/Accounts/AccountAddPage';
import AccountEditPage from './pages/Accounts/AccountEditPage';
import AccountListPage from './pages/Accounts/AccountListPage';
import AccountViewPage from './pages/Accounts/AccountViewPage';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import ClassroomListPage from './pages/Classrooms/ClassroomListPage';
import ClassroomViewPage from './pages/Classrooms/ClassroomViewPage';
import RoleEditPage from './pages/Roles/RoleEditPage';
import RoleListPage from './pages/Roles/RoleListPage';
import UserAddPage from './pages/Users/UserAddPage';
import UserEditPage from './pages/Users/UserEditPage';
import UserListPage from './pages/Users/UserListPage';
import UserViewPage from './pages/Users/UserViewPage';

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
                {/* User pages */}
                <Route exact path="/users" component={UserListPage} />
                <Route path="/users/edit/:id" component={UserEditPage} />
                <Route path="/users/add" component={UserAddPage} />
                <Route path="/users/view/:id" component={UserViewPage} />
                {/* Account pages */}
                <Route exact path="/accounts" component={AccountListPage} />
                <Route path="/accounts/edit/:id" component={AccountEditPage} />
                <Route path="/accounts/add" component={AccountAddPage} />
                <Route path="/accounts/view/:id" component={AccountViewPage} />
                {/* Course pages */}
                <Route exact path="/classrooms" component={ClassroomListPage} />
                <Route
                  path="/classrooms/view/:id"
                  component={ClassroomViewPage}
                />
                {/* Role pages */}
                <Route exact path="/roles" component={RoleListPage} />
                <Route path="/roles/edit/:id" component={RoleEditPage} />
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
