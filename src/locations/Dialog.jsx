import React from 'react';
import {useRef, useEffect} from "react";
import {Paragraph} from '@contentful/f36-components';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';
import Filerobot from "@filerobot/core";
import Explorer from "@filerobot/explorer";
import XHRUpload from "@filerobot/xhr-upload";

import "@filerobot/core/dist/style.min.css";
import "@filerobot/explorer/dist/style.min.css";

const Dialog = () => {
    const sdk = useSDK();
    const configs = sdk.parameters.installation;
    const filerobot = useRef(null);

    if (!configs.limitType || configs.limitType === "") {
        configs.limitType = [];
    } else {
        configs.limitType = configs.limitType.split(",").map(function(item) {
            return item.trim().toUpperCase()
        })
    }

    if (!configs.rootDir || configs.rootDir === "") {
        configs.rootDir = "/";
    } else if (configs.rootDir.charAt(0) !== "/") {
        configs.rootDir = `/${configs.rootDir}`;
    }

    useEffect(() => {
        if (configs.token && configs.secTemplate) {
            filerobot.current = Filerobot({
                securityTemplateId: configs.secTemplate,
                container: configs.token,
                dev: false
            })
                .use(Explorer, {
                    target: "#filerobot-widget",
                    config: {
                        rootFolderPath: configs.rootDir,
                    },
                    inline: true,
                    width: '100%',
                    height: '700px',
                    resetAfterClose: true,
                    disableExportButton: false,
                    hideExportButtonIcon: true,
                    preventExportDefaultBehavior: true,
                    disableDownloadButton: false,
                    hideDownloadButtonIcon: true,
                    preventDownloadDefaultBehavior: true,
                    noImgOperationsAndDownload: true,
                    hideDownloadTransformationOption: true,
                    disableFileResolutionFallback: true,
                    showFoldersTree: false,
                    defaultFieldKeyOfBulkEditPanel: 'title',
                    locale: {
                        strings: {
                            mutualizedExportButtonLabel: 'Insert',
                            mutualizedDownloadButton: 'Insert',
                        },
                    },
                    filters: {
                        mimeTypes: configs.limitType,
                    }
                })
                .use(XHRUpload)
                .on('export', async (files, popupExportSucessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
                    let assets = []
                    files.forEach((item, index) => {
                        let url = new URL(item.file?.url?.cdn);
                        let params = new URLSearchParams(url.search);
                        params.delete('vh');
                        url = params.toString() ? `${url.origin}${url.pathname}?${params.toString()}` : `${url.origin}${url.pathname}`;

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
            };
        }
    }, [filerobot, configs, sdk]);

    if (!configs.token || !configs.secTemplate) return <Paragraph>Please set Scaleflex DAM token and security template
        ID.</Paragraph>;

    return <>
        <div id={"filerobot-widget"}></div>
        <style>
            {`
                .filerobot-Explorer-inner {
                  max-width: 100%;
                  max-height: 100%;
                }
                .filerobot-u-reset{
                    top: 0!important;
                }
          `}
        </style>
    </>;
};

export default Dialog;
