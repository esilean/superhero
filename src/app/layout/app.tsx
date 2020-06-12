import React, { useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';

import NavBar from '../../features/nav/navbar';
import ActivityDashboard from '../../features/activities/dashboard/activity.dashboard';

import { observer } from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import HomePage from '../../features/home/home.page';
import ActivityForm from '../../features/activities/form/activity.form';
import ActivityDetails from '../../features/activities/details/activity.details';
import NotFound from './not.found';
import { RootStoreContext } from '../stores/root.store';
import { LoadingComponent } from './loading.component';
import ModalContainer from '../common/modals/modal.container';
import ProfilePage from '../../features/profiles/profile.page';
import PrivateRoute from './private.route';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { appLoaded, setAppLoaded, token } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) return <LoadingComponent content="Loading..." />;

  return (
    <>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route path="/" exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <div className="container">
            <NavBar />
            <div className="body-content">
              <div className="content">
                <Switch>
                  <PrivateRoute path="/activities" exact component={ActivityDashboard} />
                  <PrivateRoute path="/activities/:id" component={ActivityDetails} />
                  <PrivateRoute
                    key={location.key}
                    path={['/create-activity', '/activity/:id']}
                    component={ActivityForm}
                  />
                  <PrivateRoute path="/profile/:username" component={ProfilePage} />
                  <PrivateRoute component={NotFound} />
                </Switch>
              </div>
            </div>
          </div>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));
