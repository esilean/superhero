import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activity.store';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/loading.component';
import ActivityDetailedHeader from './activity.detailed.header';
import ActivityDetailedInfo from './activity.detailed.info';
import ActivityDetailedChat from './activity.detailed.chat';
import ActivityDetailedSidebar from './activity.detailed.sidebar';

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match }) => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadActivity, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  if (!activity) return <h2>Not Gound</h2>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
