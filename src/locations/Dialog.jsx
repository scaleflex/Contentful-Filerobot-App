import React, {useEffect, useRef} from 'react';
import {useSDK} from '@contentful/react-apps-toolkit';
import Filerobot from "@filerobot/core";
import Explorer from "@filerobot/explorer";
import XHRUpload from "@filerobot/xhr-upload";
import {Paragraph} from "@contentful/f36-components";

const Dialog = () => {
    const sdk = useSDK();
    const configs = sdk.parameters.installation;
    const filerobot = useRef(null);

    if (!configs.directory || configs.directory === "") {
        configs.directory = "/";
    } else if (configs.directory.charAt(0) !== "/") {
        configs.directory = `/${configs.directory}`;
    }

    useEffect(() => {
        if (configs.token && configs.sectempid) {
            const filerobotToken = configs.token;
            const filerobotSecTemp = configs.sectempid;

            filerobot.current = Filerobot({
                securityTemplateID: filerobotSecTemp,
                container: filerobotToken
            })
                .use(Explorer, {
                    config: {
                        rootFolderPath: configs.directory
                    },
                    target: "#filerobot-widget",
                    inline: true,
                    width: 750,
                    height: 500,
                    thumbnailWidth: 140,
                    thumbnailHeight: 90,
                    disableExportButton: true,
                    hideExportButtonIcon: true,
                    preventExportDefaultBehavior: true,
                    hideUploadButton: false,
                    locale: {
                        strings: {
                            mutualizedExportButtonLabel: 'Add'
                        }
                    },
                })
                .use(XHRUpload)
                .on('export', async (files, popupExportSucessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
                    let assets = []
                    files.forEach((item, index) => {
                        let url = new URL(item.file?.url?.cdn);
                        let params = new URLSearchParams(url.search);
                        params.delete('vh');
                        url = params.toString() ? `${url.origin}${url.pathname}?${params.toString()}` : `${url.origin}${url.pathname}`;

                        // Create an image tile
                        assets.push({
                            url,
                            id: item?.file?.uuid,
                            name: item?.file?.name,
                            extension: item?.file?.extension,
                            type: item?.file?.type,
                            meta: item?.file?.meta
                        })
                    });
                    sdk.close(assets);
                });

            return () => {
                filerobot.current.close();
            }
        }
    }, [filerobot, configs, sdk])

    if (!configs.token || !configs.sectempid) return <Paragraph>Please set Filerobot token and security template
        ID.</Paragraph>;

    return <div id={"filerobot-widget"}></div>;
};

export default Dialog;
