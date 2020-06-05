import React, { useEffect, useContext, useState } from 'react';
import { Grid, Loader, Responsive } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityList from './activity.list';
import { RootStoreContext } from '../../../app/stores/root.store';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './activity.filters';
import ActivityListItemPlaceholder from './activity.list.item.placeholder';

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadActivities, loadingInitial, setPage, page, totalPages } = rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // if (loadingInitial && page === 0) return <LoadingComponent content="Loading activities..." />;

  return (
    <Grid>
      <Grid.Column computer={10} mobile={16}>
        {loadingInitial && page === 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
          //  <Button
          //   floated="right"
          //   content={totalPages === page + 1 ? 'The End' : 'More...'}
          //   positive
          //   disabled={totalPages === page + 1}
          //   onClick={handleGetNext}
          //   loading={loadingNext}
          // />
        )}
      </Grid.Column>
      <Grid.Column computer={6}>
        <Responsive as={ActivityFilters} minWidth={1024} />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
