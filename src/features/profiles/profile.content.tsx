import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfilePhotos from './profile.photos';
import ProfileDescription from './profile.description';
import ProfileFollowings from './profile.followings';
import ProfileActivities from './profile.activities';

const panes = [
  {
    menuItem: 'About',
    render: () => <ProfileDescription />,
  },
  {
    menuItem: 'Photos',
    render: () => <ProfilePhotos />,
  },
  { menuItem: 'Activities', render: () => <ProfileActivities /> },
  { menuItem: 'Followers', render: () => <ProfileFollowings /> },
  { menuItem: 'Following', render: () => <ProfileFollowings /> },
];

interface IProps {
  setActiveTab: (activeIndex: any) => void;
}

export const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
    />
  );
};
