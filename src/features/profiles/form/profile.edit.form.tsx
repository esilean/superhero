import React, { useState } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Grid, Form, Button } from 'semantic-ui-react';
import { TextInput } from '../../../app/common/form/text.input';
import { TextAreaInput } from '../../../app/common/form/textarea.input';
import { IProfile } from '../../../app/models/profile';
import { observer } from 'mobx-react-lite';
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({
  displayName: isRequired('displayName'),
});

interface IProps {
  setEditBioMode: (editBioMode: boolean) => void;
  editProfile: (profile: Partial<IProfile>) => Promise<void>;
  profile: IProfile;
}

const ProfileEditForm: React.FC<IProps> = ({ editProfile, profile, setEditBioMode }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: Partial<IProfile>) => {
    setLoading(true);
    editProfile(values).then(() => {
      setLoading(false);
      setEditBioMode(false);
    });
  };

  return (
    <Grid>
      <Grid.Column width={16}>
        <FinalForm
          validate={validate}
          initialValues={profile!}
          onSubmit={handleSubmit}
          render={({ handleSubmit, invalid, pristine }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                name="displayName"
                placeholder="Display Name"
                value={profile!.displayName}
                component={TextInput}
              />
              <Field name="bio" placeholder="Bio" rows={3} value={profile!.bio} component={TextAreaInput} />

              <Button
                loading={loading}
                disabled={invalid || pristine}
                floated="right"
                positive
                type="submit"
                content="Update Profile"
              />
            </Form>
          )}
        />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfileEditForm);
