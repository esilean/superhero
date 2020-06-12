import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../app/common/form/text.input';
import { Button, Form, Header, Divider } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/root.store';
import { IUserFormValues } from '../../app/models/user';
import { FORM_ERROR } from 'final-form';
import { isRequired, combineValidators } from 'revalidate';
import { ErrorMessage } from '../../app/common/form/error.message';
import LoginFormFB from './login.form.FB';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({
  email: isRequired('email'),
  password: isRequired('password'),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login, loginFB, loadingSocial } = rootStore.userStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as="h2" content="Login to Superhero" color="violet" textAlign="center" />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field name="password" component={TextInput} placeholder="Password" type="password" />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} text={'Invalid email or password'} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="violet"
            content="Login"
            fluid
          />
          <Divider horizontal>Or</Divider>
          <LoginFormFB fbCallback={loginFB} loading={loadingSocial} />
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
