import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Header, Form, Button, Comment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/root.store';
import { Form as FinalForm, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { TextAreaInput } from '../../../app/common/form/textarea.input';
import { formatDistance } from 'date-fns';
import { IActivity } from '../../../app/models/activity';

interface IProps {
  activity: IActivity;
}

const ActivityDetailedChat: React.FC<IProps> = ({ activity }) => {
  const rootStore = useContext(RootStoreContext);
  const { createHubConnection, stopHubConnection, addComent } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(activity.id);

    return () => {
      stopHubConnection();
    };
  }, [activity.id, createHubConnection, stopHubConnection]);

  return (
    <Fragment>
      <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
        <Header>Chat about this activity</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity &&
            activity.comments &&
            activity.comments.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.imagem || `/assets/user.png`} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(new Date(comment.createdAt), new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          <FinalForm
            onSubmit={addComent}
            render={({ handleSubmit, submitting, form }) => (
              <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                <Field name="body" component={TextAreaInput} rows={2} placeholder="Add your comment" />
                <Button content="Add Reply" labelPosition="left" icon="edit" primary loading={submitting} />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedChat);
