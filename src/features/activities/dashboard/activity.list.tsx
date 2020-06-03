import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import { ActivityListItem } from './activity.list.item';
import { RootStoreContext } from '../../../app/stores/root.store';
import { formatDateLocale, getNavigatorLanguage } from '../../../app/common/util/dateFormat';

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;

  return (
    <>
      {activitiesByDate.map(([group, activities]) => {
        return (
          <Fragment key={group}>
            <Label size="large" color="blue">
              {formatDateLocale(new Date(activities[0].date), getNavigatorLanguage())}
            </Label>
            <Item.Group divided>
              {activities.map((activity) => (
                <ActivityListItem key={activity.id} activity={activity} />
              ))}
            </Item.Group>
          </Fragment>
        );
      })}
    </>
  );
};

export default observer(ActivityList);
