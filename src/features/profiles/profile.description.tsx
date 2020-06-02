import React, { useContext, useState } from 'react';
import { Grid, Tab, Header, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/root.store';
import { observer } from 'mobx-react-lite';
import ProfileEditForm from './form/profile.edit.form';

const ProfileDescription: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { isCurrentUser, profile, editProfile } = rootStore.profileStore;
  const [editBioMode, setEditBioMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="user" content={`About ${profile?.displayName}`} />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editBioMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditBioMode(!editBioMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editBioMode ? (
            <ProfileEditForm setEditBioMode={setEditBioMode} editProfile={editProfile} profile={profile!} />
          ) : (
            <span>{profile?.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
