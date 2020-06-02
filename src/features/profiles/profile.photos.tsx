import React, { useContext, useState } from 'react';
import { Tab, Header, Card, Image, Button, Grid, GridColumn } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/root.store';
import PhotoUploadWidget from '../../app/common/photoUpload/photo.upload.widget';
import { observer } from 'mobx-react-lite';

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    loadingMain,
    deletePhoto,
    deletingPhoto,
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [mainTarget, setMainTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <GridColumn width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget uploadPhoto={handleUploadImage} loading={uploadingPhoto} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          name={photo.id}
                          onClick={(e) => {
                            setMainPhoto(photo);
                            setMainTarget(e.currentTarget.name);
                          }}
                          loading={loadingMain && mainTarget === photo.id}
                          disabled={photo.isMain}
                          basic
                          positive
                          content="Main"
                        />
                        <Button
                          onClick={(e) => {
                            deletePhoto(photo);
                            setDeleteTarget(e.currentTarget.name);
                          }}
                          name={photo.id}
                          disabled={photo.isMain}
                          loading={deletingPhoto && deleteTarget === photo.id}
                          basic
                          negative
                          icon="trash"
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </GridColumn>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
