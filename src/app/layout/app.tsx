import React from 'react';
import { Container } from 'semantic-ui-react';

import NavBar from '../../features/nav/navbar';
import ActivityDashboard from '../../features/activities/dashboard/activity.dashboard';

import { observer } from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import HomePage from '../../features/home/home.page';
import ActivityForm from '../../features/activities/form/activity.form';
import ActivityDetails from '../../features/activities/details/activity.details';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <Route path="/" exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container className="body">
              <Route path="/activities" exact component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                path={['/create-activity', '/activity/:id']}
                component={ActivityForm}
              />
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));
