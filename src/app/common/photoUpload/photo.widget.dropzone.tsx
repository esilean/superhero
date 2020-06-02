import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import './styles.css';
import { Icon, Header } from 'semantic-ui-react';

interface IProps {
  setFiles: (files: object[]) => void;
}

const PhotoWidgetDropzone: React.FC<IProps> = ({ setFiles }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file: object) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={isDragActive ? 'dropzone dropzone-active' : 'dropzone'}>
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop image here" />
    </div>
  );
};

export default PhotoWidgetDropzone;
