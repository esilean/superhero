import React from 'react';
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

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Route path="/" exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container className="body">
              <Switch>
                <Route path="/activities" exact component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  key={location.key}
                  path={['/create-activity', '/activity/:id']}
                  component={ActivityForm}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));
