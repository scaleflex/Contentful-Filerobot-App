import React, { useEffect, useRef } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import Filerobot from '@filerobot/core';
import Explorer from '@filerobot/explorer';
import XHRUpload from '@filerobot/xhr-upload';
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';
import './Field.css';

const Field = () => {
  const sdk = useSDK();
  useAutoResizer();
  const configs = sdk.parameters.installation;
  const filerobot = useRef(null);
  var isPublished = !!sdk.entry.getSys().publishedVersion;

  if (!configs.directory || configs.directory === null || configs.directory === "")
  {
    configs.directory = "/";
  }
  else if (configs.directory.charAt(0) !== "/")
  {
    configs.directory = `/${configs.directory}`;
  }

  useEffect(() => {
    var existingMedia = sdk.entry.fields.fmaw.getValue();
    existingMedia = existingMedia ? existingMedia : {};
    
    if (Object.keys(existingMedia).length > 0)
    {
      Object.keys(existingMedia).forEach((key) => {
        var value = existingMedia[key];

        var tile = document.createElement('div');
        tile.classList.add('tile');
        tile.innerHTML = `<img src=${value} /><span class="close" id=${key} onClick="this.parentNode.remove(); var existingMedia = sdk.entry.fields.fmaw.getValue(); existingMedia = existingMedia ? existingMedia : {}; delete existingMedia[this.id]; sdk.entry.fields.fmaw.setValue(existingMedia);"></span>`;

        document.getElementById('selected-images').appendChild(tile);
      });
    }

    if (configs.token && configs.sectempid && !isPublished)
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
          hideUploadButton: true,
          locale: {
            strings: {
              mutualizedExportButtonLabel: 'Add'
            }
          },
        })
        .use(XHRUpload)
        // .on('complete', async ({ failed, uploadID, successful }) => { })
        .on('export', async (files, popupExportSucessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
          files.forEach((item, index) => {
            var url = new URL(item.file.url.cdn);
            var params = new URLSearchParams(url.search);
            params.delete('vh');
            url = params.toString() ? `${url.origin}${url.pathname}?${params.toString()}` : `${url.origin}${url.pathname}`;

            var uniqueId = `${Math.floor(Math.random() * 1000000000000000)}${Date.now()}`;

            var tile = document.createElement('div');
            tile.classList.add('tile');
            tile.innerHTML = `<img src=${url} /><span class="close" id=${uniqueId} onClick="this.parentNode.remove(); var existingMedia = sdk.entry.fields.fmaw.getValue(); existingMedia = existingMedia ? existingMedia : {}; delete existingMedia[this.id]; sdk.entry.fields.fmaw.setValue(existingMedia);"></span>`;

            document.getElementById('selected-images').appendChild(tile);

            var existingMedia = sdk.entry.fields.fmaw.getValue();
            existingMedia = existingMedia ? existingMedia : {};
            existingMedia[uniqueId] = url;
            sdk.entry.fields.fmaw.setValue(existingMedia);
          });
        });

      return () => {
        filerobot.current.close();
      }
    }
  }, [sdk, configs, filerobot, isPublished]);

  if (!configs.token || !configs.sectempid)
  {
    return <Paragraph>Please set Filerobot token and security template ID.</Paragraph>;
  }

  return (
    <div>
      <div id="filerobot-widget" />
      <div id="selected-images" />
    </div>
  )
};

export default Field;
