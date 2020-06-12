import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/root.store';

import './styles.css';
import { DropdownMenu } from './dropdown.menu';

const NavBar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;

  return (
    <div className="header-nav">
      <div className="nav">
        <ul>
          <li>
            <NavLink exact to="/activities">
              <img src="/assets/logo.png" alt="Logo" className="img-logo" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/create-activity">Create Activity</NavLink>
          </li>
          {user && (
            <li>
              <DropdownMenu user={user!} logout={logout} />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default observer(NavBar);
