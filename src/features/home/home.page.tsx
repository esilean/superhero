import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './styles.css';
import { RootStoreContext } from '../../app/stores/root.store';
import LoginForm from '../user/login.form';
import { RegisterForm } from '../user/register.form';

const HomePage = () => {
  const token = window.localStorage.getItem('jwt');
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  return (
    <div className="login">
      <div className="login-header">
        <img src="/assets/logo.png" alt="logo" />
        <h1>Superhero Activities</h1>
      </div>
      {isLoggedIn && user && token ? (
        <div>
          <h2>{`Welcome back ${user.displayName}`}</h2>
          <div className="login-container-button">
            <Link to="/activities">Go have fun!</Link>
          </div>
        </div>
      ) : (
        <div className="login-container">
          <h2>Welcome</h2>
          <div className="login-container-button">
            <button onClick={() => openModal(<LoginForm />)}>Login</button>
            <button onClick={() => openModal(<RegisterForm />)}>Register</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
