import React, { Fragment, useContext } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { RootStoreContext } from '../../../app/stores/root.store';
import { observer } from 'mobx-react-lite';

const ActivityFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore;

  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 51 }}>
        <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
        <Menu.Item
          active={predicate.size === 0}
          onClick={() => setPredicate('all', 'true')}
          color={'blue'}
          name={'all'}
          content={'All Activities'}
        />
        <Menu.Item
          active={predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing', 'true')}
          color={'blue'}
          name={'username'}
          content={'Going'}
        />
        <Menu.Item
          active={predicate.has('isHost')}
          onClick={() => setPredicate('isHost', 'true')}
          color={'blue'}
          name={'host'}
          content={'Hosting'}
        />
      </Menu>
      <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} />
      <DatePicker
        selected={predicate.get('startDate') || new Date()}
        onChange={(date) => setPredicate('startDate', date!)}
        inline
        className="calendar-activity"
      />
    </Fragment>
  );
};

export default observer(ActivityFilters);
