import React, { useCallback, useState, useEffect } from 'react';
import { Heading, Form, Flex } from '@contentful/f36-components';
import { css } from 'emotion';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { TextField } from '@contentful/forma-36-react-components';

const ConfigScreen = () => {
  const [parameters, setParameters] = useState({});
  const sdk = useSDK();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();
    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters = await sdk.app.getParameters();
      if (currentParameters) {
        setParameters(currentParameters);
      }
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>Filerobot Configurations</Heading>

        <TextField
          required
          name="filerobot-cname"
          id="filerobot-cname"
          labelText="CNAME"
          value={parameters.filerobotCname}
          onChange={(e) =>
            setParameters(
              {
                ...parameters, 
                filerobotCname: e.target.value || ''
              }
            )
          }
        />

        <TextField
          required
          name="filerobot-token"
          id="filerobot-token"
          labelText="Filerobot Token"
          value={parameters.filerobotToken}
          onChange={(e) =>
            setParameters(
              {
                ...parameters, 
                filerobotToken: e.target.value || ''
              }
            )
          }
        />

        <TextField
          required
          name="secu-temp-id"
          id="secu-temp-id"
          labelText="Security Template ID"
          value={parameters.secuTempId}
          onChange={(e) =>
            setParameters(
              {
                ...parameters, 
                secuTempId: e.target.value || ''
              }
            )
          }
        />

        <TextField
          required
          name="filerobot-dir"
          id="filerobot-dir"
          labelText="Filerobot Directory"
          value={parameters.filerobotDir}
          onChange={(e) =>
            setParameters(
              {
                ...parameters, 
                filerobotDir: e.target.value || ''
              }
            )
          }
        />
      </Form>
    </Flex>
  );
};
export default ConfigScreen;
