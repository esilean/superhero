import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { Button, Icon } from 'semantic-ui-react';
import { IUserFBLogin } from '../../app/models/user';
import { observer } from 'mobx-react-lite';

interface IProps {
  fbCallback: (userLoginResp: IUserFBLogin) => void;
  loading: boolean;
}

const LoginFormFB: React.FC<IProps> = ({ fbCallback, loading }) => {
  return (
    <div>
      <FacebookLogin
        appId="1374829819369844"
        fields="name,email,picture"
        callback={fbCallback}
        render={(renderProps: any) => (
          <Button onClick={renderProps.onClick} type="button" fluid color="facebook" loading={loading}>
            <Icon name="facebook" />
            Facebook
          </Button>
        )}
      />
    </div>
  );
};

export default observer(LoginFormFB);
