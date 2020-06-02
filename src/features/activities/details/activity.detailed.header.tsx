import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Segment, Item, Image, Header } from 'semantic-ui-react';
import { format } from 'date-fns';

import { IActivity } from '../../../app/models/activity';
import '../styles.css';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../../app/stores/root.store';

interface IProps {
  activity: IActivity;
}

const ActivityDetailedHeader: React.FC<IProps> = ({ activity }) => {
  const rootStore = useContext(RootStoreContext);
  const { attendActivity, cancelAttendance, loading } = rootStore.activityStore;

  const host = activity.attendees.filter((a) => a.isHost)[0];

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: '0' }}>
        <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid className="img-detailed" />
        <Segment basic className="img-detailed-text">
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size="huge" content={activity.title} style={{ color: 'white' }} />
                <p>{format(activity.date, 'eeee do MMMM')}</p>
                <p>
                  Hosted by
                  <Link to={`/profile/${host.username}`}>
                    {' '}
                    <strong style={{ color: 'white' }}>{host.displayName}</strong>
                  </Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <Button as={Link} to={`/activity/${activity.id}`} color="orange" floated="right">
            Manage Event
          </Button>
        ) : activity.isGoing ? (
          <Button loading={loading} onClick={cancelAttendance}>
            Cancel attendance
          </Button>
        ) : (
          <Button loading={loading} onClick={attendActivity} color="teal">
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
