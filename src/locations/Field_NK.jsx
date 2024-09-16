import React from 'react';
import {Grid, Box, Stack, Button, Asset} from '@contentful/f36-components';
import * as icons from '@contentful/f36-icons';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return<>
    <Stack style={{marginTop: '20px'}}>
      <Button variant="secondary" startIcon={<icons.AssetIcon />} size="small" onClick={() => showFilerobotWidget()}>
        Asset Manager
      </Button>
      {assets.length > 0 && (
          <Button size="small" startIcon={<icons.CloseIcon />} variant="negative" onClick={() => clearAll()}>
            Clear all
          </Button>
      )}
    </Stack>
  </>;
};

export default Field;
