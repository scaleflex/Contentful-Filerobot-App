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
    
    // Displaying previously selected media
    if (Object.keys(existingMedia).length > 0)
    {
      Object.keys(existingMedia).forEach((uniqueId) => {
        
        // Creating image tile
        var tile = document.createElement('div');
        var url = existingMedia[uniqueId];
        tile.classList.add('tile');
        tile.innerHTML = `<img src=${url} /><span class="close" id=${uniqueId}></span>`;
        
        // Add delete-image-tile functionality
        var closeBtn = tile.querySelector('.close');
        closeBtn.addEventListener("click", function() {

          if (isPublished) 
          { // Disable deletion if already published
            return;
          }

          tile.remove();
          var existingMedia = sdk.entry.fields.fmaw.getValue(); 
          existingMedia = existingMedia ? existingMedia : {}; 
          delete existingMedia[closeBtn.id]; 
          sdk.entry.fields.fmaw.setValue(existingMedia);
        });

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
        // .on('complete', async ({ failed, uploadID, successful }) => { }) // Since we used "hideUploadButton: true", on-complete is not needed
        .on('export', async (files, popupExportSucessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
          files.forEach((item, index) => {

            // Rid the query param: "vh"
            var url = new URL(item.file.url.cdn);
            var params = new URLSearchParams(url.search);
            params.delete('vh');
            url = params.toString() ? `${url.origin}${url.pathname}?${params.toString()}` : `${url.origin}${url.pathname}`;

            // Create an image tile
            var tile = document.createElement('div');
            var uniqueId = `${Math.floor(Math.random() * 1000000000000000)}${Date.now()}`;
            tile.classList.add('tile');
            tile.innerHTML = `<img src=${url} /><span class="close" id=${uniqueId}></span>`;

            // Add delete-image-tile functionality
            var closeBtn = tile.querySelector('.close');
            closeBtn.addEventListener("click", function() {
              
              if (isPublished) 
              { // Disable deletion if already published
                return;
              }

              tile.remove();
              var existingMedia = sdk.entry.fields.fmaw.getValue(); 
              existingMedia = existingMedia ? existingMedia : {}; 
              delete existingMedia[uniqueId]; 
              sdk.entry.fields.fmaw.setValue(existingMedia);
            });

            document.getElementById('selected-images').appendChild(tile);

            // Stored updated list of selected media to Contentful database
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
