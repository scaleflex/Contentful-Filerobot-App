import React, { useEffect, useRef } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import Filerobot from '@filerobot/core';
import Explorer from '@filerobot/explorer';
import XHRUpload from '@filerobot/xhr-upload';
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';

const Field = () => {
  const sdk = useSDK();
  useAutoResizer();
  const configs = sdk.parameters.installation; // Maybe use sdk.parameters.invocation instead
  const filerobot = useRef(null);

  if (!configs.directory || configs.directory === null || configs.directory === "")
  {
    configs.directory = "/";
  }
  else if (configs.directory.charAt(0) !== "/")
  {
    configs.directory = `/${configs.directory}`;
  }

  useEffect(() => {
    if (configs.token && configs.sectempid)
    {
      const demoContainer = configs.token;
      const demoSecurityTemplateID = configs.sectempid;

      filerobot.current = Filerobot({
        securityTemplateID: demoSecurityTemplateID,
        container: demoContainer
      })
        .use(Explorer, {
          config: {
            rootFolderPath: configs.directory
          },
          target: '#filerobot-widget',
          inline: true,
          width: '100%',
          height: '100%',
          disableExportButton: true, 
          hideExportButtonIcon: true, 
          preventExportDefaultBehavior: true,
          locale: {
            strings: {
              mutualizedExportButtonLabel: 'Add'
            }
          },
        })
        .use(XHRUpload)
        .on('export', async (files, popupExportSucessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {

        })
        .on('complete', async ({ failed, uploadID, successful }) => {

        });

      return () => {
        filerobot.current.close();
      }
    }
  }, [configs, filerobot]);

  if (!configs.token || !configs.sectempid)
  {
    return <Paragraph>Please set Filerobot token and security template ID.</Paragraph>;
  }

  return (
    <div>
      <div id="filerobot-widget" />
    </div>
  )
};

export default Field;
