import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiProfileLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { IUserLocal } from '../../app/models/user';

interface IProps {
  user: IUserLocal;
  logout: () => void;
}

export const DropdownMenu: React.FC<IProps> = ({ user, logout }) => {
  const [opened, setOpened] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);

  const toggleDropDown = () => {
    setOpened(!opened);
  };

  useEffect(() => {
    const globalClickListener = () => {
      setOpened(false);
      document.removeEventListener('click', globalClickListener);
    };

    if (opened) document.addEventListener('click', globalClickListener);
    return () => {
      document.removeEventListener('click', globalClickListener);
    };
  }, [opened]);

  return (
    <div className="nav-profile-dropdown" ref={container}>
      <button
        onClick={() => toggleDropDown()}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
      >
        <img src={user.image || '/assets/user.png'} alt="Profile" className="img-profile" />
      </button>
      {opened && (
        <div className="dropdown-content">
          <Link to={`/profile/${user.username}`}>
            <RiProfileLine className="icon" />
            <span>Profile</span>
          </Link>
          <Link to={''} onClick={logout}>
            <RiLogoutCircleRLine className="icon" />
            <span>Logout</span>
          </Link>
        </div>
      )}
    </div>
  );
};
