import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

function App() {
  return (
    <Header as="h2" icon>
      <Icon name="settings" />
      Superhero Book
      <Header.Subheader></Header.Subheader>
    </Header>
  );
}

export default App;
