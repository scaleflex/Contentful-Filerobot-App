import React, { useCallback, useState, useEffect } from 'react';
import { Heading, Form, Flex, TextInput, FormControl } from '@contentful/f36-components';
import { css } from 'emotion';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';


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
        <Heading>FileRobot DAM Configs</Heading>
        <FormControl id="token">
          <FormControl.Label>Token</FormControl.Label>
          <TextInput 
            id="token"
            name="token"
            value={parameters?.token}
            isRequired={true}
            onChange={(e) => setParameters({ ...parameters, token: e.target.value })}
          />
        </FormControl>
        <FormControl id="secTemplate">
          <FormControl.Label>Sec Template</FormControl.Label>
          <TextInput 
            id="secTemplate" 
            name="secTemplate"
            isRequired={true}
            value={parameters?.secTemplate}
            onChange={(e) => setParameters({ ...parameters, secTemplate: e.target.value })}
          />
        </FormControl>
        <FormControl id="rootDir">
          <FormControl.Label>Root Dir</FormControl.Label>
          <TextInput 
            id="rootDir"
            name="rootDir"
            isRequired={true}
            value={parameters?.rootDir}
            onChange={(e) => setParameters({ ...parameters, rootDir: e.target.value })}
          />
        </FormControl>
        <FormControl id="limit">
          <FormControl.Label>Limit</FormControl.Label>
          <TextInput
            type="number"
            id="limit"
            name="limit"
            value={parameters?.limit}
            onChange={(e) => setParameters({ ...parameters, limit: Number(e.target.value) })}
          />
          <Flex justifyContent="space-between">
            <FormControl.HelpText>
              is optional (limit for all files type ex: 3)
            </FormControl.HelpText>
          </Flex>
        </FormControl>
        <FormControl id="attributes">
          <FormControl.Label>Attributes</FormControl.Label>
          <TextInput
            id="attributes"
            name="attributes"
            value={parameters?.attributes}
            onChange={(e) => setParameters({ ...parameters, attributes: e.target.value })}
          />
          <Flex justifyContent="space-between">
            <FormControl.HelpText>
              is optional (ex: meta, tags, info)
            </FormControl.HelpText>
          </Flex>
        </FormControl>
        <FormControl id="limitType ">
          <FormControl.Label>Limit Type</FormControl.Label>
          <TextInput
            id="limitType"
            name="limitType"
            value={parameters?.limitType}
            onChange={(e) => setParameters({ ...parameters, limitType: e.target.value })}
          />
          <Flex justifyContent="space-between">
            <FormControl.HelpText>
              is optional (ex: image, document, video, audio)
            </FormControl.HelpText>
          </Flex>
        </FormControl>
      </Form>
    </Flex>
  );
};
export default ConfigScreen;
